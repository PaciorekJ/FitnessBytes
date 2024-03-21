import mongoose from "mongoose";
import { FriendNotificationModel, FriendRequestNotificationModel, INotification, MessageNotificationModel, NotificationTypes, PostLikedNotificationModel } from "../models/Notification";

import { Request } from "express";
import { RequestWithSocket } from "../middleware/socketMiddleware";
import { IConversation } from "../models/Conversation";
import { IFriendRequest } from "../models/FriendRequest";
import { IPost } from "../models/Post";
import UserModel, { IUser } from "../models/User";

type NotificationData = IPost | IFriendRequest | IConversation;

class NotificationStrategyFactory {
    static create(type: NotificationTypes) {
        // Defaults to Parent and parent will throw an Error
        let notificationStrategy: NotificationStrategy<NotificationData> = new NotificationStrategy();

        if (type === NotificationTypes.FriendRequest) {
            notificationStrategy = new NotificationStrategyFriendRequest();
        }
        else if (type === NotificationTypes.NewFriend) {
            notificationStrategy = new NotificationStrategyFriend();
        }
        else if (type === NotificationTypes.MessageReceived) {
            notificationStrategy = new NotificationStrategyMessage();
        }
        else if (type === NotificationTypes.PostLiked) {
            notificationStrategy = new NotificationStrategyPostLiked();
        }
        return new NotificationEmitterDecorator<NotificationData>(notificationStrategy);
    }
}

class NotificationStrategy<T> {
    async handle(data: T, req: Request | RequestWithSocket ): Promise<INotification[] | void> { 
        throw new Error("WARNING: Notification Parent Strategy Called! This more then likely indicated a Error");
    };
}

class NotificationStrategyMessage implements NotificationStrategy<IConversation> {
    async handle(data: IConversation, req: Request): Promise<INotification[]> {
        const userId = (req.user as IUser)._id;
        const notifications: Promise<INotification>[] = [];

        try {
            data.participantIds.map((participantId, i) => {
                const id = new mongoose.Types.ObjectId(participantId);
                if (id.equals(userId)) return null;

                notifications.push(MessageNotificationModel.create({
                    recipientId: id,
                    recipientUsername: data.participantUsernames[i],
                    conversationId: data._id,
                    senderId: userId,
                    senderUsername: (req.user as IUser).username,
                }));
            });

            return await Promise.all(notifications);
        }
        catch {
            console.error("Failed to process message");
        }
        return [];
    }
}

class NotificationStrategyPostLiked implements NotificationStrategy<IPost> {
	async handle(data: IPost, req: Request): Promise<INotification[]> {
        const id: mongoose.Types.ObjectId = (req.user as IUser)._id
        const notifications: Promise<INotification>[] = []; 

        if (id.equals(data.userId)) return [];
		
        try {
            notifications.push(PostLikedNotificationModel.create({
                    recipientId: data.userId,
                    recipientUsername: data.username,
                    postId: data._id,
                    likerId: (req.user as IUser)._id,
                    likerUsername: (req.user as IUser).username,
                }));

            return await Promise.all(notifications);
        }
        catch {
            console.error("PostLike Notification failed");
        }
        return [];
	}
}

class NotificationStrategyFriendRequest implements NotificationStrategy<IFriendRequest> {
    async handle(data: IFriendRequest, req: Request): Promise<INotification[]> {
        const notifications: Promise<INotification>[] = []; 

        const recipientUsername = (await UserModel.findById(data.recipientId).select("username") as IUser).username;
        if (!recipientUsername) return [];

        try {
            notifications.push(FriendRequestNotificationModel.create({
                recipientId: data.recipientId,
                recipientUsername,
                requesterId: data.requesterId,
                requesterUsername: (req.user as IUser).username
            }));

            return await Promise.all(notifications);
        }
        catch {
            console.error("Friend Request Notification Failed");
        }
        return [];
    }
}

class NotificationStrategyFriend implements NotificationStrategy<IFriendRequest> {
	async handle(data: IFriendRequest, req: Request): Promise<INotification[]> {
		const { username: requesterUsername } = await UserModel.findById(data.requesterId) as IUser;
		
        const recipientUsername = (await UserModel.findById(data.recipientId).select("username") as IUser).username;
        if (!recipientUsername) return [];

        const notifications: Promise<INotification>[] = [];
        try {
            notifications.push(FriendNotificationModel.create({
                recipientId: data.recipientId,
                recipientUsername: recipientUsername,
                requesterId: data.requesterId,
                requesterUsername: requesterUsername
            }));
        
            notifications.push(FriendNotificationModel.create({
                recipientId: data.requesterId,
                recipientUsername: requesterUsername,
                requesterId: data.recipientId,
                requesterUsername: recipientUsername,
            }));

            return await Promise.all(notifications);
        }
        catch {
            console.error("Friend Notification Failed");
        }
        return [];
	}
}

class NotificationEmitterDecorator<T> implements NotificationStrategy<T> {
    
    constructor(private component: NotificationStrategy<T>) {}

    async handle(data: T, req: RequestWithSocket): Promise<void> {

        let notifications: INotification[] = [];    
        notifications = await (this.component.handle(data, req)) || [];  

        if (!req.io) throw new Error("IO SOCKET HAS NOT BEEN ATTACHED TO REQUEST");

        notifications.map((notification) => {
            req.io.to("User:" + notification.recipientUsername).emit("Notification Recieved", notification);
        })
    }

}

export default NotificationStrategyFactory;