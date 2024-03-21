import { Avatar, Link, Typography } from "@mui/material";
import Notification from "../components/Notification";
import FriendRequestServices from "../services/FriendRequestServices";
import { INotification } from "../services/NotificationServices";
import useBannerStore from "../hooks/useBannerStore";

interface FriendRequestProps extends INotification {
	requesterId: string;
	requesterUsername: string;
}

const FriendRequestNotification = ({
	type,
	_id,
	requesterId,
	requesterUsername,
	timeCreated,
}: FriendRequestProps) => {

	const setNotification = useBannerStore(s => s.setNotification);

	const onAccept = async () => {
		const newFriend = await FriendRequestServices.accept(requesterId);

		if (newFriend) {
			setNotification(`You and ${requesterUsername} are now friends!`);
			return;
		}
		setNotification(
			`An Error occurred while attempting to accept ${requesterUsername}'s friend request.`,
		);
	};

	const onReject = async () => {
		const success = await FriendRequestServices.decline(requesterId);

		if (success) {
			setNotification(
				`You've Successfully declined ${requesterUsername}'s friend request!`,
			);
			return;
		}
		setNotification(
			`An Error occurred while declining ${requesterUsername}'s friend request!`,
		);
	};

	return (
		<Notification
			type={type}
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
					from{" "}
					<Link href={"/auth/account/" + requesterUsername}>{requesterUsername}</Link>
				</>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { FriendRequestProps };
export default FriendRequestNotification;
