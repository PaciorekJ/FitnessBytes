import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import ConversationModel from "../models/Conversation";
import MessageModel, { IMessage } from "../models/Message";
import { NotificationTypes } from "../models/Notification";
import { IUser } from "../models/User";
import NotificationStrategyFactory from "../services/NotificationStrategyFactory";

const messageRouter = Router();

messageRouter.get('/:conversationId', authMiddleware, async (req, res) => {
    const username = (req.user as IUser).username;
    let _id: string | mongoose.Types.ObjectId = req.params.conversationId;

    // *** Verify User has access to this conversation ***
    try {
        _id = new mongoose.Types.ObjectId(_id);
    } catch {
        res.status(400).json({
            message: "Invalid ID",
        });
        return;
    }
    try {
        const participants : string[] = (await ConversationModel.findById(_id).select('participants -_id'))?.participants || [];
        const isAMember = participants.some(p => p === username);
        if (!isAMember) {
            res.status(403).json({
                message: "Forbidden, You are not a member of this conversation",
            })
        }

        // *** Retrieve messages ***
        const messages = await MessageModel.find({conversation: _id});
        res.json({
            message: "",
            result: messages
        })
    }
    catch (e) {
        res.status(500).json({
            message: "Internal Server Error",
        })
    }
})

messageRouter.post('/', authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id; 
    const username = (req.user as IUser).username;
    const content = req.body.content;
    let _id = req.body.conversation;

    try {
        _id = new mongoose.Types.ObjectId(_id);
    } catch {
        res.status(400).json({
            message: "Invalid ID",
        });
        return;
    }

    if (!content) {
        res.status(400).json({
            message: "Invalid content for message",
        });
        return;
    }

    try {
        const message = await MessageModel.create({
            conversation: _id,
            sender: userId,
            senderUsername: username,
            content
        } as Partial<IMessage>);

        const conversation = await ConversationModel.findById(_id);

        NotificationStrategyFactory.create(NotificationTypes.MessageReceived)(conversation, req);
    
        res.status(201).json({
            message: "",
            result: message,
        })
    }
    catch (e) {
        res.status(500).json({
            message: `${e}`
        })
    }
})

messageRouter.delete("/:messageId", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    let _id: string | mongoose.Types.ObjectId = req.params.messageId;
    
    try {
        _id = new mongoose.Types.ObjectId(_id);
    } catch {
        res.status(400).json({
            message: "Invalid ID",
        });
        return;
    }

    try {
        const deletedMessage = await MessageModel.findOneAndDelete({_id, sender: userId});

        res.json({
            message: "",
            result: deletedMessage,
        })
    }
    catch (e) {
        res.status(500).json({
            message: `${e}`
        })
    }
})

export default messageRouter;