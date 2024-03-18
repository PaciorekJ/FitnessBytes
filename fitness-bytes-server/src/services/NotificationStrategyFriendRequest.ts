import { Request } from "express";
import { IFriendRequest } from "../models/FriendRequest";
import { FriendRequestNotificationModel } from "../models/Notification";
import { IUser } from "../models/User";
import NotificationStrategy from "./NotificationStrategy";

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

export default NotificationStrategyFriendRequest;