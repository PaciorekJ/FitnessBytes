import { Typography } from "@mui/material";
import { INotification } from "../services/NotificationServices";
import Notification from "./Notification";
import ProfilePicture from "./ProfilePicture";

interface MessageNotificationProps extends INotification {
	conversationId: string;
}

const MessageNotification = ({
	type,
	_id,
	dispatcherUsername,
	timeCreated,
}: MessageNotificationProps) => {
	return (
		<Notification
			type={type}
			_id={_id}
			actions
			icon={<ProfilePicture username={dispatcherUsername} />}
			content={
				<>
					You have a{" "}
					<Typography component="b" fontWeight={600}>
						new message
					</Typography>{" "}
					from{" "}
					<Typography component="b" fontWeight={600}>
						{dispatcherUsername}
					</Typography>
				</>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { MessageNotificationProps };

export default MessageNotification;
