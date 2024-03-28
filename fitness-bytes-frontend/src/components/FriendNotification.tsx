import { Link, Typography } from "@mui/material";
import Notification from "../components/Notification";
import { INotification } from "../services/NotificationServices";
import ProfilePicture from "./ProfilePicture";

interface FriendNotificationProps extends INotification {}

const FriendNotification = ({
	type,
	_id,
	dispatcherUsername,
	profilePicture,
	profilePictureType,
	timeCreated,
}: FriendNotificationProps) => {
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
					You and{" "}
					<Typography component="b" fontWeight={600}>
						<Link href={"/auth/account/" + dispatcherUsername}>
							{dispatcherUsername}
						</Link>
					</Typography>{" "}
					are now{" "}
					<Typography component="b" fontWeight={600}>
						friends
					</Typography>
				</>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { FriendNotificationProps };
export default FriendNotification;
