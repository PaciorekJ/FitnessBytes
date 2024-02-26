import { Stack, Typography } from "@mui/material";
import useUserStore from "../hooks/useUserStore";
import { IMessage } from "../pages/MessageBoard";
import MessageBubble from "./MessageBubble";

interface Props {
	message: IMessage;
}

const Message = ({ message }: Props) => {

	const username = useUserStore((s) => s.username);

	const isLoading = false;
	const Error = "";

	const time = new Date(message.timeCreated || "").toString();

	console.log(`${message.username} === ${username}`);

	const isUsers = message.username === username;

	return (
		<Stack
			sx={{
				flexDirection: "column",
				...(isUsers ? { alignItems: "end" } : {}),
			}}>
			{!Error && (
				<>
					<Typography>{message.username}</Typography>
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
