import { Avatar, Typography } from "@mui/material";
import { INotification } from "../services/NotificationServices";
import Notification from "./Notification";

interface PostLikedNotificationProps extends INotification {
	postId: string;
    likerId: string;
	likerUsername: string;
}

const PostLikedNotification = ({
	_id,
	likerId,
	likerUsername,
	timeCreated,
}: PostLikedNotificationProps) => {
	return (
		<Notification
			_id={_id}
			actions
			icon={<Avatar>{likerId.charAt(0)}</Avatar>}
			content={
				<>
					<Typography component="b" fontWeight={600}>
						{likerUsername}
					</Typography>{" "}
					liked one of your posts
				</>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { PostLikedNotificationProps };
export default PostLikedNotification;
