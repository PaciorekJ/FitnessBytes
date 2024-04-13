import { Typography } from "@mui/material";
import { ContentType, INotification } from "../services/NotificationServices";
import Notification from "./Notification";
import ProfilePicture from "./ProfilePicture";

interface ReplyLikedNotificationProps extends INotification {
	contentId: string;
    contentType: ContentType;
}

const ReplyLikedNotification = ({
	type,
	_id,
	dispatcherUsername,
	timeCreated,
}: ReplyLikedNotificationProps) => {
	return (
		<Notification
			type={type}
			_id={_id}
			actions
			icon={<ProfilePicture username={dispatcherUsername} />}
			content={
				<>
					<Typography component="b" fontWeight={600}>
						{dispatcherUsername}
					</Typography>{" "}
					liked one of your replies
				</>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { ReplyLikedNotificationProps };
export default ReplyLikedNotification;
