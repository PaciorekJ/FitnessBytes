import { Link, Typography } from "@mui/material";
import { ReactNode } from "react";
import AlertContent from "../components/AlertContent";
import { FriendNotificationProps } from "../components/FriendNotification";
import { FriendRequestProps as FriendRequestNotificationProps } from "../components/FriendRequestNotification";
import { MessageNotificationProps } from "../components/MessageNotification";
import { PostLikedNotificationProps } from "../components/PostLikedNotification";
import ProfilePicture from "../components/ProfilePicture";
import { INotification, NotificationTypes } from "./NotificationServices";

class AlertNotificationFactory {
	create(payload: INotification | string): ReactNode {
		if (typeof payload === "string") {
			return <AlertContent icon={null} content={payload} />;
		}
		if (payload.type === NotificationTypes.FriendRequest) {
			const props = payload as FriendRequestNotificationProps;
			return (
				<AlertContent
					icon={<ProfilePicture username={props.dispatcherUsername} />}
					content={
						<>
							You have a{" "}
							<Typography component="b" fontWeight={600}>
								friend request
							</Typography>{" "}
							from{" "}
							<Typography component={"b"}>
								<Link href={"/auth/account/" + props.dispatcherUsername}>
									{props.dispatcherUsername}
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
					icon={<ProfilePicture username={props.dispatcherUsername} />}
					content={
						<>
							You and{" "}
							<Typography component="b" fontWeight={600}>
								<Link href={"/auth/account/" + props.dispatcherUsername}>
									{props.dispatcherUsername}
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
					icon={<ProfilePicture username={props.dispatcherUsername} />}
					content={
						<>
							You have a{" "}
							<Typography component="b" fontWeight={600}>
								new message
							</Typography>{" "}
							from{" "}
							<Typography component="b" fontWeight={600}>
								{props.dispatcherUsername}
							</Typography>
						</>
					}
				/>
			);
		} else if (payload.type === NotificationTypes.PostLiked) {
			const props = payload as PostLikedNotificationProps;
			return (
				<AlertContent
					icon={<ProfilePicture username={props.dispatcherUsername} />}
					content={
						<>
							<Typography component="b" fontWeight={600}>
								{props.dispatcherUsername}
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
