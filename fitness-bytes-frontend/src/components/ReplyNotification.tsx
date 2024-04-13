
import { Typography } from "@mui/material";
import { ContentType, INotification } from "../services/NotificationServices";
import Notification from "./Notification";
import ProfilePicture from "./ProfilePicture";

interface ReplyNotificationProps extends INotification {
	contentId: string;
    contentType: ContentType;
}

const ReplyNotification = ({
	type,
	_id,
	dispatcherUsername,
	timeCreated,
    contentType,
}: ReplyNotificationProps) => {
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
					replied to your {contentType === ContentType.postId ? "post": "reply to a post"}
				</>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { ReplyNotificationProps };
export default ReplyNotification;
