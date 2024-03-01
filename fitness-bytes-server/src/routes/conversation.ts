import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import ConversationModel, { IConversation } from "../models/Conversation";
import MessageModel from "../models/Message";
import { IUser } from "../models/User";

const conversationRouter = Router();

conversationRouter.get('/', authMiddleware, async (req, res) => {
    const _id = (req.user as IUser)._id; // This will never fail given the authMiddleware

    let conversations;
    try {
        conversations = await ConversationModel.find({
            participants: _id,
        });
    } catch {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

    res.json({
        message: "",
        result: conversations,
    })


})

conversationRouter.get('/:conversationId', async (req, res) => {
    let _id: string | mongoose.Types.ObjectId = req.params.conversationId;

    try {
        _id = new mongoose.Types.ObjectId(_id);
    } catch {
        res.status(400).json({
            message: "Invalid ID",
        });
    }

    let conversation: IConversation | null;

    try {
        conversation = await ConversationModel.findById(_id);
    } catch (e) {
        res.status(500).json({
            message: `${e}`
        })
        return;
    }

    res.json({
        message: "",
        result: conversation,
    })
});

conversationRouter.delete('/:conversationId', async (req, res) => {
    let _id: string | mongoose.Types.ObjectId = req.params.conversationId;

    try {
        _id = new mongoose.Types.ObjectId(_id);
    } catch {
        res.status(400).json({
            message: "Invalid ID",
        });
    }

    res.json({
        message: "",
        result: await ConversationModel.deleteOne({_id})
    })
})

// *** Note: Conversations require a message to create one ***
conversationRouter.post('/', authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    
    try {
        let messageContent = req.body.messageContent;
        let title = req.body.title || null;
        
        let invalidIds = 0;
        const participants = (req.body.participants as string[]).reduce((acc, id) =>{
            try {
                const objectId = new mongoose.Types.ObjectId(id);
    
                // Remove userId if included to ensure its only in participants once
                if (!userId.equals(objectId)) {
                    acc.push(objectId);
                }

            } catch {
                invalidIds ++;
            }

            return acc;
        }, [] as mongoose.Types.ObjectId[]);

        if (invalidIds > 0) {
            res.status(400).json({
                message: "Invalid Participant Id(s) were provided"
            })
            return;
        }
        
        const updatedParticipants = [...participants, userId]
        const conversation = await ConversationModel.create({
            participants: updatedParticipants,
            title,
        } as Partial<IConversation>);
        
        // *** Add Message to new Conversation ***
        const message = await MessageModel.create({
            conversation: conversation._id,
            sender: userId,
            content: messageContent,
        });
    
        res.status(201).json({
            message: "",
            result: {
                conversation: conversation,
                message: message,
            }
        })
    } catch (e) {
        res.status(500).json({
            message: `${e}`,
        })
    }
})

export default conversationRouter;