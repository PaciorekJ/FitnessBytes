import { Stack, Typography } from "@mui/material";
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
				<Stack width={"100%"} flexDirection={"row"}>
					<Typography>
						You and{" "}
						<Typography
							component="a"
							color={"secondary"}
							sx={{ textDecoration: "none" }}
							href={"/auth/account/" + dispatcherUsername}>
							{dispatcherUsername}
						</Typography>{" "}
						are now{" "}
						<Typography component="b" color={"secondary"} fontWeight={600}>
							friends
						</Typography>
					</Typography>
				</Stack>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { FriendNotificationProps };
export default FriendNotification;
