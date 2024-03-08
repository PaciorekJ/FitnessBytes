import { Avatar, Typography } from "@mui/material";
import Notification from "../components/Notification";
import FriendRequestServices from "../services/FriendRequestServices";
import { INotification } from "../services/NotificationServices";

interface FriendRequestProps extends INotification {
	requesterId: string;
	requesterUsername: string;
	timeCreated: string;
}

const FriendRequestNotification = ({
	_id,
	requesterId,
	requesterUsername,
	timeCreated,
}: FriendRequestProps) => {
	const onAccept = async () => {
		const newFriend = await FriendRequestServices.accept(requesterId);

		if (newFriend) {
			alert(`You and ${requesterUsername} are now friends!`);
			return;
		}
		alert(
			`An Error occurred while attempting to accept ${requesterUsername}'s friend request.`,
		);
	};

	const onReject = async () => {
		const success = await FriendRequestServices.decline(requesterId);

		if (success) {
			alert(
				`You've Successfully declined ${requesterUsername}'s friend request!`,
			);
			return;
		}
		alert(
			`An Error occurred while declining ${requesterUsername}'s friend request!`,
		);
	};

	return (
		<Notification
			_id={_id}
			actions
			actionOnAccept={onAccept}
			actionOnReject={onReject}
			icon={<Avatar>{requesterUsername.charAt(0)}</Avatar>}
			content={
				<>
					You have a{" "}
					<Typography component="b" fontWeight={600}>
						friend request
					</Typography>{" "}
					from {requesterUsername}
				</>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { FriendRequestProps };
export default FriendRequestNotification;
