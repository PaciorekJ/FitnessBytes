import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import ConversationModel, { IConversation } from "../models/Conversation";
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
        result: (await ConversationModel.deleteOne({_id})).deletedCount
    })
})
conversationRouter.post('/', authMiddleware, async (req, res) => {
    const username = (req.user as IUser).username;
    
    try {
        let title = req.body.title || null;
        const participants = (req.body.participants as string[]).filter((p) => p !== username);
        
        if (!participants.length) {
            return res.status(400).json({
                message: "A Conversation requires at least 1 participant besides the creator"
            })
        }
        
        const updatedParticipants = [...participants, username]
        const conversation = await ConversationModel.create({
            participants: updatedParticipants,
            title,
        } as Partial<IConversation>);
    
        return res.status(201).json({
            message: "",
            result: conversation
        })
    } catch (e) {
        return res.status(500).json({
            message: `${e}`,
        })
    }
})

export default conversationRouter;