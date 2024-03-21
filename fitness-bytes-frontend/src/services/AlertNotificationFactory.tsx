import { Avatar, Link, Typography } from "@mui/material";
import { ReactNode } from "react";
import AlertContent from "../components/AlertContent";
import { FriendNotificationProps } from "../components/FriendNotification";
import { FriendRequestProps as FriendRequestNotificationProps } from "../components/FriendRequestNotification";
import { MessageNotificationProps } from "../components/MessageNotification";
import { PostLikedNotificationProps } from "../components/PostLikedNotification";
import { INotification, NotificationTypes } from "./NotificationServices";

class AlertNotificationFactory {
	create(payload: INotification | string): ReactNode {
		if (typeof payload === "string") {
			return (
				<AlertContent icon={null} content={payload} />
			);
		} else if (payload.type === NotificationTypes.FriendRequest) {
			const props = payload as FriendRequestNotificationProps;
			return (
				<AlertContent
					icon={<Avatar>{props.requesterUsername.charAt(0)}</Avatar>}
					content={
						<>
							You have a{" "}
							<Typography component="b" fontWeight={600}>
								friend request
							</Typography>{" "}
							from{" "}
							<Typography component={"b"}>
								<Link href={"/auth/account/" + props.requesterUsername}>
									{props.requesterUsername}
								</Link>
							</Typography>
						</>
					}
				/>
			);
		} else if (payload.type === NotificationTypes.NewFriend) {
			const props = payload as FriendNotificationProps;
			return (
				<AlertContent
					icon={<Avatar>{props.requesterUsername.charAt(0)}</Avatar>}
					content={
						<>
							You and{" "}
							<Typography component="b" fontWeight={600}>
								<Link href={"/auth/account/" + props.requesterUsername}>
									{props.requesterUsername}
								</Link>
							</Typography>{" "}
							are now{" "}
							<Typography component="b" fontWeight={600}>
								friends
							</Typography>
						</>
					}
				/>
			);
		} else if (payload.type === NotificationTypes.MessageReceived) {
			const props = payload as MessageNotificationProps;
			return (
				<AlertContent
					icon={<Avatar>{props.senderUsername.charAt(0)}</Avatar>}
					content={
						<>
							You have a{" "}
							<Typography component="b" fontWeight={600}>
								new message
							</Typography>{" "}
							from{" "}
							<Typography component="b" fontWeight={600}>
								{props.senderUsername}
							</Typography>
						</>
					}
				/>
			);
		} else if (payload.type === NotificationTypes.PostLiked) {
			const props = payload as PostLikedNotificationProps;
			return (
				<AlertContent
					icon={<Avatar>{props.likerUsername.charAt(0)}</Avatar>}
					content={
						<>
							<Typography component="b" fontWeight={600}>
								{props.likerUsername}
							</Typography>{" "}
							just liked one of your posts!
						</>
					}
				/>
			);
		}
		return null;
	}
}

export { AlertNotificationFactory };
