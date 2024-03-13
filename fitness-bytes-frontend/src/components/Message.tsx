import { Stack, Typography } from "@mui/material";
import useUserStore from "../hooks/useUserStore";
import { IMessage } from "../services/MessageServices";
import ParseDateFromNow from "../utils/ParseDate";
import MessageBubble from "./MessageBubble";

interface Props {
	message: IMessage;
}

const Message = ({ message }: Props) => {
	const username = useUserStore((s) => s.username);

	const isLoading = false;
	const Error = "";

	const time = ParseDateFromNow(new Date(message.timeCreated || ""));

	const isUsers = message.senderUsername === username;

	return (
		<Stack
			sx={{
				flexDirection: "column",
				...(isUsers ? { alignItems: "end" } : { alignItems: "start" }),
			}}>
			{!Error && (
				<>
					<Typography color={"text.secondary"}>
						{message.senderUsername}
					</Typography>
					<MessageBubble isCurrentUsers={isUsers}>
						{message.content}
					</MessageBubble>
					{message.timeCreated && (
						<Typography variant={"body2"} color={"text.disabled"}>
							{time}
						</Typography>
					)}
					{!isLoading && (
						<Typography variant={"body2"} color={"text.disabled"}>
							{isUsers ? "Sent" : "Recieved"}
						</Typography>
					)}
				</>
			)}
		</Stack>
	);
};

export default Message;
