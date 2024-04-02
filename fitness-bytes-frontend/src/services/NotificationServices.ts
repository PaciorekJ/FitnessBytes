


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
	recipientUsername: string;
    dispatcherId: string;
    dispatcherUsername: string;
    profilePicture: string;
    profilePictureType: string;
	timeCreated: Date;
}

type NotificationResponse = ResponseResult<INotification[]>;

class NotificationServices {
	private static fact = new EndpointFactory<NotificationResponse>("/notifications");

    static getAll = (pageNumber: number, pageLength: number) => this.fact.get<INotification[]>("/", {
        params: {pageNumber, pageLength}
    })();
    static delete = (id: string) => this.fact.delete<boolean>("/one/")(id);
    static deleteAll = () => this.fact.delete<number>("/all")();
    static deleteByConversation = this.fact.delete<number>("/conversation/")

	static getMessageCount = () => this.fact.get<number>("/message/count")();
	static getCount = () => this.fact.get<number>("/count")();
}

export { NotificationTypes };
export type { INotification };
export default NotificationServices;