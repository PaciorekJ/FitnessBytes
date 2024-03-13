import { Stack, Typography } from "@mui/material";
import useUserStore from "../hooks/useUserStore";
import MessageBubble from "./MessageBubble";
import { IMessage } from "../services/MessageServices";

interface Props {
	message: IMessage;
}

const Message = ({ message }: Props) => {
	const username = useUserStore((s) => s.username);

	const isLoading = false;
	const Error = "";

	const time = new Date(message.timeCreated || "").toString();

	const isUsers = message.senderUsername === username;

	return (
		<Stack
			sx={{
				flexDirection: "column",
				...(isUsers ? { alignItems: "end" } : {alignItems: "start" }),
			}}>
			{!Error && (
				<>
					<Typography>{message.senderUsername}</Typography>
					<MessageBubble isCurrentUsers={isUsers}>
						{message.content}
					</MessageBubble>
					{message.timeCreated && (
						<Typography variant={"body2"}>{time}</Typography>
					)}
					{!isLoading && (
						<Typography variant={"body2"}>
							{isUsers ? "Sent" : "Recieved"}
						</Typography>
					)}
				</>
			)}
		</Stack>
	);
};

export default Message;
