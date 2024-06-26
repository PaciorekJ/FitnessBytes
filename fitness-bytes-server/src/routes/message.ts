import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import socketMiddleware, { RequestWithSocket } from "../middleware/socketMiddleware";
import userConfigMiddleware from "../middleware/userConfigMiddleware";
import ConversationModel, { IConversation } from "../models/Conversation";
import MessageModel, { IMessage } from "../models/Message";
import { NotificationTypes } from "../models/Notification";
import { IUser } from "../models/User";
import NotificationStrategyFactory from "../services/NotificationStrategyFactory";

const messageRouter = Router();

messageRouter.get('/:conversationId', authMiddleware, async (req, res) => {
    const username = (req.user as IUser).username;
    let _id: string | mongoose.Types.ObjectId = req.params.conversationId;

    const {pageLength: pageLengthRaw, pageNumber: pageNumberRaw} = req.query as {pageLength: string, pageNumber: string};
    const pageLength = parseInt(pageLengthRaw) || 5;
    const pageNumber = parseInt(pageNumberRaw) || 0;

    // *** Verify User has access to this conversation ***
    try {
        _id = new mongoose.Types.ObjectId(_id);
    } catch {
        return res.status(400).json({
            message: "Invalid ID",
        });
    }
    try {
        const participants : string[] = (await ConversationModel.findById(_id).select('participantUsernames -_id'))?.participantUsernames || [];
        const isAMember = participants.some(p => p === username);
        if (!isAMember) {
            return res.status(403).json({
                message: "Forbidden, You are not a member of this conversation",
            })
        }

        // *** Retrieve messages ***
        const messages = await MessageModel.aggregate(
            [
                {
                    $match: {
                        conversation: _id
                    }
                },
                {
                    $sort: { "timeCreated": -1 },
                },
                {
                    $skip: pageLength * pageNumber,
                },
                {
                    $limit: pageLength
                },

            ]
        );

        return res.json({
            message: "",
            result: messages
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "Internal Server Error",
        })
    }
})

messageRouter.post('/', authMiddleware, socketMiddleware, userConfigMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id; 
    const username = (req.user as IUser).username;
    const content = req.body.content;
    let _id = req.body.conversation;

    try {
        _id = new mongoose.Types.ObjectId(_id);
    } catch {
        return res.status(400).json({
            message: "Invalid ID",
        });
    }

    if (!content) {
        return res.status(400).json({
            message: "Invalid content for message",
        });
    }

    try {
        const message = await MessageModel.create({
            conversation: _id,
            sender: userId,
            senderUsername: username,
            content
        } as Partial<IMessage>);

        const conversation = await ConversationModel.findById(_id) || {} as IConversation;

        NotificationStrategyFactory.create(NotificationTypes.MessageReceived).handle(conversation, req as RequestWithSocket);
    
        return res.status(201).json({
            message: "",
            result: message,
        })
    }
    catch (e) {
        return res.status(500).json({
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
        return res.status(400).json({
            message: "Invalid ID",
        });
    }

    try {
        const deletedMessage = await MessageModel.findOneAndDelete({_id, sender: userId});

        return res.json({
            message: "",
            result: deletedMessage,
        })
    }
    catch (e) {
        return res.status(500).json({
            message: `${e}`
        })
    }
})

export default messageRouter;