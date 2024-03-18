import { Request } from "express";
import { IFriendRequest } from "../models/FriendRequest";
import { FriendNotificationModel } from "../models/Notification";
import { IUser } from "../models/User";
import NotificationStrategy from "./NotificationStrategy";

class NotificationStrategyFriend implements NotificationStrategy<IFriendRequest> {
	async handle(data: IFriendRequest, req: Request): Promise<void> {
		console.log("Friend Processed");
		await FriendNotificationModel.create({
			recipientId: data.recipientId,
			requesterId: data.requesterId,
			requesterUsername: (req.user as IUser).username,
		});
	}
}

export default NotificationStrategyFriend;
