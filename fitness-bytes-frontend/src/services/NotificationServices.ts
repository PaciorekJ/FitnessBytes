


import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

interface INotification {
    _id: string;
	type:
		| "Friend Request"
		| "New Friend"
		| "Post Liked"
		| "Post Replied"
		| "Message Received"
		| "Group Activity";
	recipientId: string;
	timeCreated: Date;
}

type NotificationResponse = ResponseResult<INotification[]>;

class NotificationServices {
	private static fact = new EndpointFactory<NotificationResponse>("/notifications");

    static getAll = () => this.fact.get<INotification[]>()();
    static delete = this.fact.delete<boolean>();
}

export type { INotification };
export default NotificationServices;