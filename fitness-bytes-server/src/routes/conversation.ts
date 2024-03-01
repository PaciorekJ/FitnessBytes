import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import ConversationModel, { IConversation } from "../models/Conversation";
import MessageModel from "../models/Message";
import { IUser } from "../models/User";

const conversationRouter = Router();

conversationRouter.get('/', authMiddleware, async (req, res) => {
    const username = (req.user as IUser).username; // This will never fail given the authMiddleware

    let conversations;
    try {
        conversations = await ConversationModel.find({
            participants: username,
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
    const username = (req.user as IUser).username;
    
    try {
        let messageContent = req.body.messageContent;
        let title = req.body.title || null;
        const participants = (req.body.participants as string[]).filter((p) => p !== username);
        
        const updatedParticipants = [...participants, username]
        const conversation = await ConversationModel.create({
            participants: updatedParticipants,
            title,
        } as Partial<IConversation>);
        
        // *** Add Message to new Conversation ***
        const message = await MessageModel.create({
            conversation: conversation._id,
            sender: userId,
            senderUsername: username,
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