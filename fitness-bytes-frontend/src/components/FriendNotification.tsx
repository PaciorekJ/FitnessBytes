import { Link, Typography } from "@mui/material";
import Notification from "../components/Notification";
import { INotification } from "../services/NotificationServices";
import ProfilePicture from "./ProfilePicture";

interface FriendNotificationProps extends INotification {}

const FriendNotification = ({
	type,
	_id,
	dispatcherUsername,
	timeCreated,
}: FriendNotificationProps) => {
	return (
		<Notification
			type={type}
			_id={_id}
			actions
			icon={<ProfilePicture username={dispatcherUsername} />}
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
