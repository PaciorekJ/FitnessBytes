import { ReactNode } from "react";
import FriendRequestNotification, {
	FriendRequestProps as FriendRequestNotificationProps,
} from "../components/FriendRequestNotification";
import { INotification } from "./NotificationServices";
import FriendNotification, { FriendNotificationProps } from "../components/FriendNotification";
import MessageNotification, { MessageNotificationProps } from "../components/MessageNotification";
import PostLikedNotification, { PostLikedNotificationProps } from "../components/PostLikedNotification";

class NotificationFactory {
	create(payload: INotification): ReactNode {
		if (payload.type === "Friend Request") {
			const props = payload as FriendRequestNotificationProps;
			return <FriendRequestNotification {...props} />;
		}
		else if (payload.type === "New Friend") {
			const props = payload as FriendNotificationProps;
			return <FriendNotification {...props} />;
		}
		else if (payload.type === "Message Received") {
			const props = payload as MessageNotificationProps;
			return <MessageNotification {...props} />;
		}
		else if (payload.type === "Post Liked") {
			const props = payload as PostLikedNotificationProps;
			return <PostLikedNotification {...props} />;
		}
		return null;
	}
}

// Extending the Notification interface for a Post Replied Notification
interface PostRepliedNotification extends INotification {
	type: "Post Replied";
	postId: string;
	replyId: string;
	repliedByUserId: string;
	repliedByUserName: string;
	timestamp: Date;
}

// Extending the Notification interface for a Group Activity Notification
interface GroupActivityNotification extends INotification {
	type: "Group Activity";
	groupId: string;
	activityType: "Member Joined" | "Event Created" | "Post Created";
	triggeredByUserId: string;
	triggeredByUserName: string;
	timestamp: Date;
}

export type {
	GroupActivityNotification,
	PostRepliedNotification,
};

export { NotificationFactory };
