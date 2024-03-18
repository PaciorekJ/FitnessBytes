import { Avatar, Link, Typography } from "@mui/material";
import Notification from "../components/Notification";
import { INotification } from "../services/NotificationServices";

interface FriendNotificationProps extends INotification {
	requesterId: string;
	requesterUsername: string;
}

const FriendNotification = ({
	_id,
	requesterUsername,
	timeCreated,
}: FriendNotificationProps) => {
	return (
		<Notification
			_id={_id}
			actions
			icon={<Avatar>{requesterUsername.charAt(0)}</Avatar>}
			content={
				<>
					You and{" "}
					<Typography component="b" fontWeight={600}>
						<Link href={"/auth/account/" + requesterUsername}>
							{requesterUsername}
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
