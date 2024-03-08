


import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

interface INotification {
    _id: string;
	type:
		| "Friend Request"
		| "Post Liked"
		| "Post Replied"
		| "Message Received"
		| "Group Activity";
	recipientId: string;
}

type NotifcationResponse = ResponseResult<INotification[]>;

class NotificationServices {
	private static fact = new EndpointFactory<NotifcationResponse>("/notifications");

    static getAll = () => this.fact.get<INotification[]>()();
    static delete = this.fact.delete<boolean>();
}

export type { INotification };
export default NotificationServices;