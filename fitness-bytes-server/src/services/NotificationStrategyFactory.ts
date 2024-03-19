import mongoose from "mongoose";
import { FriendNotificationModel, FriendRequestNotificationModel, MessageNotificationModel, NotificationTypes, PostLikedNotificationModel } from "../models/Notification";

import { Request } from "express";
import { IConversation } from "../models/Conversation";
import { IFriendRequest } from "../models/FriendRequest";
import { IPost } from "../models/Post";
import UserModel, { IUser } from "../models/User";

class NotificationStrategyFactory {
    static create(type: NotificationTypes) {
        if (type === NotificationTypes.FriendRequest) {
            return new NotificationStrategyFriendRequest().handle;
        }
        else if (type === NotificationTypes.NewFriend) {
            return new NotificationStrategyFriend().handle;
        }
        else if (type === NotificationTypes.MessageReceived) {
            return new NotificationStrategyMessage().handle;
        }
        else if (type === NotificationTypes.PostLiked) {
            return new NotificationStrategyPostLiked().handle;
        }
        return new NotificationStrategy().handle;
    }
}

class NotificationStrategy<T> {
    handle(data: T, req?: Request): void | Promise<void> {
        console.error("Notification Strategy selected is not valid");
    }
}

class NotificationStrategyMessage implements NotificationStrategy<IConversation> {
	async handle(data: IConversation, req: Request & {io: any}): Promise<void> {
        const userId = (req.user as IUser)._id
        const username = (req.user as IUser).username

        try {
            data.participantIds.map(async (participantId)=> {
                const id = new mongoose.Types.ObjectId(participantId);
                if (id.equals(userId)) return;
                
                const notification = await MessageNotificationModel.create({
                    recipientId: id,
                    conversationId: data._id,
                    senderId: (req.user as IUser)._id,
                    senderUsername: (req.user as IUser).username,
                });
                req.io.to("User:" + username).emit("Notification Recieved", notification);
                console.log("Notification Emitted");
            })
            console.log("Message Processed");
        }
        catch {
            console.log("Failed to process message");
        }
	}
}

class NotificationStrategyPostLiked extends NotificationStrategy<IPost> {
	async handle(data: IPost, req: Request): Promise<void> {
		console.log("PostLike Processed");
        const id: mongoose.Types.ObjectId = (req.user as IUser)._id
        if (id.equals(data.userId)) return;
		await PostLikedNotificationModel.create({
            recipientId: data.userId,
            postId: data._id,
            likerId: (req.user as IUser)._id,
            likerUsername: (req.user as IUser).username,
        });
	}
}

class NotificationStrategyFriendRequest implements NotificationStrategy<IFriendRequest> {
    async handle(data: IFriendRequest, req: Request): Promise<void> {
        console.log("Friend Request Processed");
        await FriendRequestNotificationModel.create({
            recipientId: data.recipientId,
            requesterId: data.requesterId,
            requesterUsername: (req.user as IUser).username
        });
    }
}

class NotificationStrategyFriend implements NotificationStrategy<IFriendRequest> {
	async handle(data: IFriendRequest, req: Request): Promise<void> {
		const { username: requesterUsername } = await UserModel.findById(data.requesterId) as IUser;
		await FriendNotificationModel.create({
			recipientId: data.recipientId,
			requesterId: data.requesterId,
			requesterUsername
		});
		await FriendNotificationModel.create({
			recipientId: data.requesterId,
			requesterId: data.requesterId,
			requesterUsername: (req.user as IUser).username
		});
	}
}

export default NotificationStrategyFactory;