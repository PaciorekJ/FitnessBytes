import { Typography } from "@mui/material";
import { INotification } from "../services/NotificationServices";
import Notification from "./Notification";
import ProfilePicture from "./ProfilePicture";

interface MessageNotificationProps extends INotification {
	converstionId: string;
}

const MessageNotification = ({
	type,
	_id,
	dispatcherUsername,
	profilePicture,
	profilePictureType,
	timeCreated,
}: MessageNotificationProps) => {
	return (
		<Notification
			type={type}
			_id={_id}
			actions
			icon={
				<ProfilePicture
					username={dispatcherUsername}
					base64Image={profilePicture}
					pictureType={profilePictureType}
				/>
			}
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
