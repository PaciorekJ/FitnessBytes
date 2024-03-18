import { Avatar, Typography } from "@mui/material";
import { INotification } from "../services/NotificationServices";
import Notification from "./Notification";

interface MessageNotificationProps extends INotification {
	converstionId: string;
	senderId: string;
	senderUsername: string;
}

const MessageNotification = ({
	type,
	_id,
	senderUsername,
	timeCreated,
}: MessageNotificationProps) => {
	return (
		<Notification
			type={type}
			_id={_id}
			actions
			icon={<Avatar>{senderUsername.charAt(0)}</Avatar>}
			content={
				<>
					You have a{" "}
					<Typography component="b" fontWeight={600}>
						new message
					</Typography>{" "}
					from{" "}
					<Typography component="b" fontWeight={600}>
						{senderUsername}
					</Typography>
				</>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { MessageNotificationProps };

export default MessageNotification;
