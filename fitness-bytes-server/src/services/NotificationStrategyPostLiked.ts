
import { Request } from "express";
import mongoose from "mongoose";
import { PostLikedNotificationModel } from "../models/Notification";
import { IPost } from "../models/Post";
import { IUser } from "../models/User";
import NotificationStrategy from "./NotificationStrategy";

class NotificationStrategyPostLiked implements NotificationStrategy<IPost> {
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

export default NotificationStrategyPostLiked;
