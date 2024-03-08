import { Avatar, Typography } from "@mui/material";
import Notification from "../components/Notification";
import FriendRequestServices from "./FriendRequestServices";
import { INotification } from "./NotificationServices";

interface FriendRequestPayload extends INotification {
	requesterId: string;
	requesterUsername: string;
	timeCreated: string;
}

class NotificationFactory {
	create(payload: INotification) {
		if (payload.type === "Friend Request") {
			const friendRequestPayload = payload as FriendRequestPayload;
			return new FriendRequestNotification(
				friendRequestPayload.requesterId,
				friendRequestPayload.requesterUsername,
				new Date(friendRequestPayload.timeCreated),
			);
		}
		return null;
	}
}

// Extending the Notification interface for a Friend Request Notification
class FriendRequestNotification {
	constructor(
		private requesterId: string,
		private requesterUsername: string,
		private timeCreated: Date,
	) {}

	render = () => {
		return (
			<Notification
				key={`${this.requesterId}__${this.requesterUsername}__${this.timeCreated}`}
				actions
				actionOnAccept={async () => {
					const newFriend = await FriendRequestServices.accept(
						this.requesterId,
					);

					if (newFriend) {
						alert(`You and ${this.requesterUsername} are now friends!`);
						return;
					}
					alert(
						`An Error occurred while attempting to accept ${this.requesterUsername}'s friend request.`,
					);
				}}
				actionOnReject={async () => {
					const success = await FriendRequestServices.decline(this.requesterId);

					if (success) {
						alert(
							`You've Successfully declined ${this.requesterUsername}'s friend request!`,
						);
						return;
					}
					alert(
						`An Error occurred while declining ${this.requesterUsername}'s friend request!`,
					);
				}}
				icon={
					<>
						<Avatar>{this.requesterUsername.charAt(0)}</Avatar>
					</>
				}
				content={
					<>
						You have a{" "}
						<Typography component="b" fontWeight={600}>
							friend request
						</Typography>{" "}
						from {this.requesterUsername}
					</>
				}
				timestamp={this.timeCreated}
			/>
		);
	};
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

export { FriendRequestNotification, NotificationFactory };

export type {
	FriendRequestPayload,
	GroupActivityNotification,
	MessageReceivedNotification,
	PostLikedNotification,
	PostRepliedNotification,
};
