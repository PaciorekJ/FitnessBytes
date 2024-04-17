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

interface ReplyNotificationProps extends INotification {
	contentId: string;
	contentType: ContentType;
}

const ReplyNotification = ({
	type,
	_id,
	dispatcherUsername,
	timeCreated,
	contentId,
	contentType,
}: ReplyNotificationProps) => {
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
							color={"secondary"}
							sx={{ textDecoration: "none" }}
							href={`/auth/account/${dispatcherUsername}#top`}>
							{dispatcherUsername}
						</Typography>{" "}
						replied to your{" "}
						{contentType === ContentType.postId ? "post" : "reply to a post"}{" "}
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

export type { ReplyNotificationProps };
export default ReplyNotification;
