import { Stack, Typography } from "@mui/material";
import Notification from "../components/Notification";
import useBannerStore from "../hooks/useBannerStore";
import FriendRequestServices from "../services/FriendRequestServices";
import { INotification } from "../services/NotificationServices";
import ProfilePicture from "./ProfilePicture";

interface FriendRequestProps extends INotification {}

const FriendRequestNotification = ({
	type,
	_id,
	dispatcherId,
	dispatcherUsername,
	timeCreated,
}: FriendRequestProps) => {
	const setBanner = useBannerStore((s) => s.setBanner);

	const onAccept = async () => {
		const newFriend = await FriendRequestServices.accept(dispatcherId);

		if (newFriend) {
			return;
		}
		setBanner(
			`An Error occurred while attempting to accept ${dispatcherUsername}'s friend request.`,
			true,
		);
	};

	const onReject = async () => {
		const success = await FriendRequestServices.decline(dispatcherId);

		if (success) {
			setBanner(
				`You've Successfully declined ${dispatcherUsername}'s friend request!`,
			);
			return;
		}
		setBanner(
			`An Error occurred while declining ${dispatcherUsername}'s friend request!`,
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
			icon={<ProfilePicture username={dispatcherUsername} />}
			content={
				<Stack flexDirection={"row"}>
					<Typography>
						You have a{" "}
						<Typography component="b" color={"secondary"} fontWeight={600}>
							friend request
						</Typography>{" "}
						from{" "}
						<Typography
							component={"a"}
							color={"secondary"}
							sx={{ textDecoration: "none" }}
							href={"/auth/account/" + dispatcherUsername}>
							{dispatcherUsername}
						</Typography>
					</Typography>
				</Stack>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { FriendRequestProps };
export default FriendRequestNotification;
