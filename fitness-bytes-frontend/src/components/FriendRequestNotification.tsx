import { Avatar, Link, Typography } from "@mui/material";
import Notification from "../components/Notification";
import useBannerStore from "../hooks/useBannerStore";
import FriendRequestServices from "../services/FriendRequestServices";
import { INotification } from "../services/NotificationServices";

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
	const setBanner = useBannerStore((s) => s.setBanner);

	const onAccept = async () => {
		const newFriend = await FriendRequestServices.accept(requesterId);

		if (newFriend) {
			return;
		}
		setBanner(
			`An Error occurred while attempting to accept ${requesterUsername}'s friend request.`,
			true,
		);
	};

	const onReject = async () => {
		const success = await FriendRequestServices.decline(requesterId);

		if (success) {
			setBanner(
				`You've Successfully declined ${requesterUsername}'s friend request!`,
			);
			return;
		}
		setBanner(
			`An Error occurred while declining ${requesterUsername}'s friend request!`,
			true,
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
					<Link href={"/auth/account/" + requesterUsername}>
						{requesterUsername}
					</Link>
				</>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { FriendRequestProps };
export default FriendRequestNotification;
