


import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

enum NotificationTypes {
    FriendRequest = "Friend Request",
    NewFriend = "New Friend",
    PostReplied = "Post Replied",
    MessageReceived = "Message Received",
    PostLiked = "Post Liked",
    GroupActivity = "Group Activity",
}

interface INotification {
    _id: string;
	type: NotificationTypes;
	recipientId: string;
	timeCreated: Date;
}

type NotificationResponse = ResponseResult<INotification[]>;

class NotificationServices {
	private static fact = new EndpointFactory<NotificationResponse>("/notifications");

    static getAll = () => this.fact.get<INotification[]>()();
    static delete = this.fact.delete<boolean>();

	static getMessageCount = () => this.fact.get<number>("/message/count")();
	static getCount = () => this.fact.get<number>("/count")();
}

export { NotificationTypes };
export type { INotification };
export default NotificationServices;