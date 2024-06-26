import mongoose from "mongoose";
import { ContentType, FriendNotificationModel, FriendRequestNotificationModel, INotification, MessageNotificationModel, NotificationTypes, PostLikedNotificationModel, ReplyLikedNotificationModel, ReplyNotificationModel } from "../models/Notification";

import { Request } from "express";
import { RequestWithSocket } from "../middleware/socketMiddleware";
import { IConversation } from "../models/Conversation";
import { IFriendRequest } from "../models/FriendRequest";
import PostModel, { IPost } from "../models/Post";
import ReplyModel, { IReply } from "../models/Reply";
import UserModel, { IUser } from "../models/User";
import UserConfigModel from "../models/UserConfig";

type NotificationData = IPost | IFriendRequest | IConversation | IReply;

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
        else if (type === NotificationTypes.ReplyLiked) {
            notificationStrategy = new NotificationStrategyReplyLiked();
        }
        else if (type === NotificationTypes.Replied) {
            notificationStrategy = new NotificationStrategyReply();
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
        const notificationPromises: Promise<INotification | null>[] = [];

        data.participantIds.forEach((participantId, i) => {
            const id = new mongoose.Types.ObjectId(participantId);
            if (id.equals(userId)) return; // Skip if the participant is the sender

            const promise = UserConfigModel.findOne({username: data.participantUsernames[i]})
                .then(config => {
                    if (config?.message) {
                        return MessageNotificationModel.create({
                            conversationId: data._id,
                            recipientId: id,
                            recipientUsername: data.participantUsernames[i],
                            dispatcherId: userId,
                            dispatcherUsername: (req.user as IUser).username,
                        });
                    }
                    return null;
                });
            notificationPromises.push(promise);
        });

        try {
            // Await all the notification creation promises
            const notifications = await Promise.all(notificationPromises);
            return notifications.filter(notify => notify !== null) as INotification[];
        } catch (error) {
            console.error("Failed to process message notifications", error);
            return [];
        }
    }
}


class NotificationStrategyPostLiked implements NotificationStrategy<IPost> {
	async handle(data: IPost, req: Request): Promise<INotification[]> {
        const id: mongoose.Types.ObjectId = (req.user as IUser)._id
        const notifications: Promise<INotification>[] = []; 

        const config = await UserConfigModel.findOne({username: data.username});

        if (id.equals(data.userId)) return [];
		
        try {
            if (config?.like) {
                notifications.push(PostLikedNotificationModel.create({
                        postId: data._id,
                        recipientId: data.userId,
                        recipientUsername: data.username,
                        dispatcherId: (req.user as IUser)._id,
                        dispatcherUsername: (req.user as IUser).username,
                    }));
            }

            return await Promise.all(notifications);
        }
        catch {
            console.error("PostLike Notification failed");
        }
        return [];
	}
}

class NotificationStrategyReplyLiked implements NotificationStrategy<IReply> {
	async handle(data: IReply, req: Request): Promise<INotification[]> {
        const id: mongoose.Types.ObjectId = (req.user as IUser)._id
        const notifications: Promise<INotification>[] = []; 
        
        try {
            if (!data._id) {
                throw new Error("Invalid data provided to notification ReplyLike");
            }

            const user = await UserModel.findById(data.userId);
            const config = await UserConfigModel.findOne({username: user?.username});

            if (id.equals(user?._id) || !config?.replyLiked) return [];

            notifications.push(ReplyLikedNotificationModel.create({
                recipientUsername: user?.username,
                recipientId: user?._id,
                dispatcherId: (req.user as IUser)._id,
                dispatcherUsername: (req.user as IUser).username,
                contentId: data._id,
                contentType: ContentType.replyId
            }));
            return await Promise.all(notifications);
        }
        catch (e){
            console.error(`Reply Liked Notification failed: ${e}`);
        }
        return [];
	}
}

class NotificationStrategyReply implements NotificationStrategy<IReply> {
	async handle(data: IReply, req: Request): Promise<INotification[]> {
        const id: mongoose.Types.ObjectId = (req.user as IUser)._id
        const notifications: Promise<INotification>[] = []; 

        let userId: mongoose.Types.ObjectId | undefined = undefined;
        let type: ContentType = ContentType.postId;
        try {
            if (data.parentReplyId) {
                const reply = await ReplyModel.findById(data.parentReplyId);
                userId = reply?.userId;
                type = ContentType.replyId;
            }
            else {
                const post = await PostModel.findById(data.postId);
                userId = post?.userId;
            }

            if (!userId) {
                throw new Error("No User associated with post/reply");
            }
            const user = await UserModel.findById(userId);
            const config = await UserConfigModel.findOne({username: user?.username});

            if (id.equals(userId)) return [];
        
            if (config?.reply) {
                notifications.push(ReplyNotificationModel.create({
                        recipientUsername: user?.username,
                        recipientId: user?._id,
                        dispatcherId: (req.user as IUser)._id,
                        dispatcherUsername: (req.user as IUser).username,
                        contentId: data._id,
                        contentType: type
                    }));
            }

            return await Promise.all(notifications);
        }
        catch {
            console.error("Reply Notification failed");
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
                recipientUsername: recipientUsername,
                dispatcherId: data.requesterId,
                dispatcherUsername: (req.user as IUser).username
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
        
        const recipientConfig = await UserConfigModel.findOne({username: recipientUsername});
        const requesterConfig = await UserConfigModel.findOne({username: requesterUsername});

        if (!recipientUsername) return [];

        const notifications: Promise<INotification>[] = [];
        try {
            if (recipientConfig?.friend) {
                notifications.push(FriendNotificationModel.create({
                    recipientId: data.recipientId,
                    recipientUsername: recipientUsername,
                    dispatcherId: data.requesterId,
                    dispatcherUsername: requesterUsername
                }));
            }
        
            if (requesterConfig?.friend) {
                notifications.push(FriendNotificationModel.create({
                    recipientId: data.requesterId,
                    recipientUsername: requesterUsername,
                    dispatcherId: data.recipientId,
                    dispatcherUsername: recipientUsername,
                }));
            }

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

        notifications.map(async (notification) => {

            const res: Partial<IUser> | null = await UserModel.findOne({_id: notification.dispatcherId}).select("profilePicture profilePictureType");
            
            if (!res) {
                req.io.to("User:" + notification.recipientUsername).emit("Notification Recieved", notification);
            }

            const { profilePicture, profilePictureType } = res; 
            req.io.to("User:" + notification.recipientUsername).emit("Notification Recieved", {
                ...notification.toObject(),
                profilePicture: profilePicture, 
                profilePictureType: profilePictureType
            });
        })
    }

}

export default NotificationStrategyFactory;