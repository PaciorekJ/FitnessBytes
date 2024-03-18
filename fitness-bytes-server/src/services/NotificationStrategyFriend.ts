import { Request } from "express";
import { IFriendRequest } from "../models/FriendRequest";
import { FriendNotificationModel } from "../models/Notification";
import UserModel, { IUser } from "../models/User";
import NotificationStrategy from "./NotificationStrategy";

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

export default NotificationStrategyFriend;
