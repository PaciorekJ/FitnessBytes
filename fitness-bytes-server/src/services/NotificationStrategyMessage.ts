

import { Request } from "express";
import { IConversation } from "../models/Conversation";
import { PostLikedNotificationModel } from "../models/Notification";
import { IUser } from "../models/User";
import NotificationStrategy from "./NotificationStrategy";

class NotificationStrategyMessage implements NotificationStrategy<IConversation> {
	async handle(data: IConversation, req: Request): Promise<void> {
		console.log("Message Processed");
        data.participants.map(async (recipientId) => {
            await PostLikedNotificationModel.create({
                recipientId,
                conversationId: data._id,
                senderId: (req.user as IUser)._id,
                senderUsername: (req.user as IUser).username,
            });
        })
	}
}

export default NotificationStrategyMessage;
