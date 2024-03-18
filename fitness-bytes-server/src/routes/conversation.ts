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
            participantUsernames: username,
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
    const id = (req.user as IUser)._id;
    
    try {
        let title = req.body.title || null;
        const participantUsernames = (req.body.participantUsernames as string[]).filter((p) => p !== username);
        const participantIds = (req.body.participantIds as string[]).filter((p) => p !== id);
        
        if (!participantUsernames.length || !participantIds.length) {
            return res.status(400).json({
                message: "A Conversation requires at least 1 participant besides the creator"
            })
        }
        
        const updatedUsernames = [...participantUsernames, username];
        const updatedIds = [...participantIds, id];
        const conversation = await ConversationModel.create({
            participantUsernames: updatedUsernames,
            participantIds: updatedIds,
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