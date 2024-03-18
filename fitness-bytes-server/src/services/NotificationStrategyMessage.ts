

import { Request } from "express";
import mongoose from "mongoose";
import { IConversation } from "../models/Conversation";
import { MessageNotificationModel } from "../models/Notification";
import { IUser } from "../models/User";
import NotificationStrategy from "./NotificationStrategy";

class NotificationStrategyMessage implements NotificationStrategy<IConversation> {
	async handle(data: IConversation, req: Request): Promise<void> {
        try {
            data.participantIds.map(async (participantId)=> {
                const id = new mongoose.Types.ObjectId(participantId);
                await MessageNotificationModel.create({
                    recipientId: id,
                    conversationId: data._id,
                    senderId: (req.user as IUser)._id,
                    senderUsername: (req.user as IUser).username,
                });
            })
            console.log("Message Processed");
        }
        catch {
            console.log("Failed to process message");
        }
	}
}

export default NotificationStrategyMessage;
