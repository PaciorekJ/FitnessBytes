import { ReactNode } from "react";
import FriendRequestNotification, {
	FriendRequestProps,
} from "../components/FriendRequestNotification";
import { INotification } from "./NotificationServices";

class NotificationFactory {
	create(payload: INotification): ReactNode {
		if (payload.type === "Friend Request") {
			const props = payload as FriendRequestProps;
			return <FriendRequestNotification {...props} />;
		}
		return null;
	}
}

// Extending the Notification interface for a Post Liked Notification
interface PostLikedNotification extends INotification {
	type: "Post Liked";
	postId: string;
	likedByUserId: string;
	likedByUserName: string;
	timestamp: Date;
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

// Extending the Notification interface for a Message Received Notification
interface MessageReceivedNotification extends INotification {
	type: "Message Received";
	messageId: string;
	fromUserId: string;
	fromUserName: string;
	messagePreview: string;
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
	MessageReceivedNotification,
	PostLikedNotification,
	PostRepliedNotification,
};

export { NotificationFactory };
