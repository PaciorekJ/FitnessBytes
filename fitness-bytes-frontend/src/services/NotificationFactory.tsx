import { ReactNode } from "react";
import FriendNotification, {
	FriendNotificationProps,
} from "../components/FriendNotification";
import FriendRequestNotification, {
	FriendRequestProps as FriendRequestNotificationProps,
} from "../components/FriendRequestNotification";
import MessageNotification, {
	MessageNotificationProps,
} from "../components/MessageNotification";
import PostLikedNotification, {
	PostLikedNotificationProps,
} from "../components/PostLikedNotification";
import ReplyLikedNotification, {
	ReplyLikedNotificationProps,
} from "../components/ReplyLikedNotification";
import ReplyNotification, {
	ReplyNotificationProps,
} from "../components/ReplyNotification";
import { INotification, NotificationTypes } from "./NotificationServices";

class NotificationFactory {
	create(payload: INotification): ReactNode {
		if (payload.type === NotificationTypes.FriendRequest) {
			const props = payload as FriendRequestNotificationProps;
			return <FriendRequestNotification {...props} />;
		} else if (payload.type === NotificationTypes.NewFriend) {
			const props = payload as FriendNotificationProps;
			return <FriendNotification {...props} />;
		} else if (payload.type === NotificationTypes.MessageReceived) {
			const props = payload as MessageNotificationProps;
			return <MessageNotification {...props} />;
		} else if (payload.type === NotificationTypes.PostLiked) {
			const props = payload as PostLikedNotificationProps;
			return <PostLikedNotification {...props} />;
		} else if (payload.type === NotificationTypes.Replied) {
			const props = payload as ReplyNotificationProps;
			return <ReplyNotification {...props} />;
		} else if (payload.type === NotificationTypes.ReplyLiked) {
			const props = payload as ReplyLikedNotificationProps;
			return <ReplyLikedNotification {...props} />;
		}
		return null;
	}
}

// Still in Development
// Extending the Notification interface for a Group Activity Notification
interface GroupActivityNotification extends INotification {
	type: NotificationTypes.GroupActivity;
	groupId: string;
	activityType: "Member Joined" | "Event Created" | "Post Created";
	triggeredByUserId: string;
	triggeredByUserName: string;
	timestamp: Date;
}

export type { GroupActivityNotification };

export { NotificationFactory };
