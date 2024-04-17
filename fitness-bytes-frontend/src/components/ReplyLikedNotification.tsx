import { Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import useReply from "../hooks/useReply";
import NotificationServices, {
	ContentType,
	INotification,
} from "../services/NotificationServices";
import Notification from "./Notification";
import ProfilePicture from "./ProfilePicture";
import Reply from "./Reply";

interface ReplyLikedNotificationProps extends INotification {
	contentId: string;
	contentType: ContentType;
}

const ReplyLikedNotification = ({
	type,
	_id,
	contentId,
	dispatcherUsername,
	timeCreated,
}: ReplyLikedNotificationProps) => {
	const { data: reply, isLoading } = useReply(contentId);

	useEffect(() => {
		const removeNotificationsForDeletedPost = async () => {
			await NotificationServices.delete(_id);
		};

		if (!isLoading && !reply) {
			removeNotificationsForDeletedPost();
		}
	}, [_id, isLoading, reply]);

	if (!reply || isLoading) return null;

	return (
		<Notification
			type={type}
			_id={_id}
			actions
			icon={<ProfilePicture username={dispatcherUsername} />}
			content={
				<Stack width={"100%"}>
					<Typography>
						<Typography
							component="a"
							sx={{ textDecoration: "none" }}
							color={"secondary"}
							href={`/auth/account/${dispatcherUsername}#top`}>
							{dispatcherUsername}
						</Typography>{" "}
						liked one of your replies
					</Typography>
					<Stack width={"50vw"} maxWidth={"700px"} margin={"auto"} padding={2}>
						<Reply {...reply!} disabled={true} />
					</Stack>
				</Stack>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { ReplyLikedNotificationProps };
export default ReplyLikedNotification;
