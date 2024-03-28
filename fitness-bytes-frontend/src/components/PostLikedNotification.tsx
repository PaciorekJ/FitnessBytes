import { Typography } from "@mui/material";
import { INotification } from "../services/NotificationServices";
import Notification from "./Notification";
import ProfilePicture from "./ProfilePicture";

interface PostLikedNotificationProps extends INotification {
	postId: string;
}

const PostLikedNotification = ({
	type,
	_id,
	dispatcherUsername,
	profilePicture,
	profilePictureType,
	timeCreated,
}: PostLikedNotificationProps) => {
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
					<Typography component="b" fontWeight={600}>
						{dispatcherUsername}
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
