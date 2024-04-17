import { Typography } from "@mui/material";
import useConversation from "../hooks/useConversation";
import { INotification } from "../services/NotificationServices";
import Notification from "./Notification";
import ProfilePicture from "./ProfilePicture";

interface MessageNotificationProps extends INotification {
	conversationId: string;
}

const MessageNotification = ({
	type,
	_id,
	conversationId,
	dispatcherUsername,
	timeCreated,
}: MessageNotificationProps) => {
	const { data: conversation, isLoading } = useConversation(conversationId);

	if (isLoading || !conversation) return null;

	const title =
		conversation.title ||
		conversation.participantUsernames.join(", ") ||
		"Empty Conversation";

	return (
		<Notification
			type={type}
			_id={_id}
			actions
			icon={<ProfilePicture username={dispatcherUsername} />}
			content={
				<Typography>
					You have a{" "}
					<Typography component="b" color={"secondary"} fontWeight={600}>
						NEW
					</Typography>{" "}
					message in{" "}
					<Typography component="b" color={"secondary"} fontWeight={600}>
						{title}
					</Typography>{" "}
					from{" "}
					<Typography
						component="a"
						href={`/auth/account/${dispatcherUsername}#top`}
						color={"secondary"}
						sx={{ textDecoration: "none" }}>
						{dispatcherUsername}
					</Typography>
				</Typography>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { MessageNotificationProps };

export default MessageNotification;
