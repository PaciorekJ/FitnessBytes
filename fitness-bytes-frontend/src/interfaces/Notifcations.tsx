import { Avatar, Typography } from "@mui/material";
import { ReactNode } from "react";
import Notification from "../components/Notification";

// Base Notification interface with a type property
interface Notification {
	type:
		| "Friend Request"
		| "Post Liked"
		| "Post Replied"
		| "Message Received"
		| "Group Activity";
	render?: (key: string) => ReactNode;
}

interface NotificationPayload {
	fromUserId: string;
	fromUsername: string;
	timestamp: Date;
}

class NotificationFactory {
	create(payload: Notification & NotificationPayload) {
		if (payload.type === "Friend Request") {
			return new FriendRequestNotification(
				payload.fromUserId,
				payload.fromUsername,
				payload.timestamp,
			);
		}
		return null;
	}
}

// Extending the Notification interface for a Friend Request Notification
class FriendRequestNotification {
	constructor(
		private fromUserId: string,
		private fromUsername: string,
		private timestamp: Date,
	) {}

	render = (key: string) => {
		return (
			<Notification
				key={key}
				actions
				actionOnAccept={() => console.log("Accepted")}
				actionOnReject={() => console.log("Rejected")}
				icon={
					<>
						<Avatar>{this.fromUsername.charAt(0)}</Avatar>
					</>
				}
				content={
					<>
						You have a{" "}
						<Typography component="b" fontWeight={600}>
							friend request
						</Typography>{" "}
						from {this.fromUsername}
					</>
				}
				timestamp={this.timestamp}
			/>
		);
	};
}

// Extending the Notification interface for a Post Liked Notification
interface PostLikedNotification extends Notification {
	type: "Post Liked";
	postId: string;
	likedByUserId: string;
	likedByUserName: string;
	timestamp: Date;
}

// Extending the Notification interface for a Post Replied Notification
interface PostRepliedNotification extends Notification {
	type: "Post Replied";
	postId: string;
	replyId: string;
	repliedByUserId: string;
	repliedByUserName: string;
	timestamp: Date;
}

// Extending the Notification interface for a Message Received Notification
interface MessageReceivedNotification extends Notification {
	type: "Message Received";
	messageId: string;
	fromUserId: string;
	fromUserName: string;
	messagePreview: string;
	timestamp: Date;
}

// Extending the Notification interface for a Group Activity Notification
interface GroupActivityNotification extends Notification {
	type: "Group Activity";
	groupId: string;
	activityType: "Member Joined" | "Event Created" | "Post Created";
	triggeredByUserId: string;
	triggeredByUserName: string;
	timestamp: Date;
}

export { FriendRequestNotification, NotificationFactory };

export type {
	GroupActivityNotification,
	MessageReceivedNotification,
	Notification,
	NotificationPayload,
	PostLikedNotification,
	PostRepliedNotification,
};
