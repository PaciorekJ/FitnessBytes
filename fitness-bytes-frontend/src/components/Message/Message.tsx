import { Stack, Typography } from "@mui/material";
import { IMessage } from "../../pages/MessageBoard";
import MessageBubble from "../MessageBubble/MessageBubble";
import styles from "./index.module.css";

interface Props {
	message: IMessage;
}

const Message = ({ message }: Props) => {
	const username = localStorage.getItem("username");

	const isLoading = false;
	const Error = "";

	const time = new Date(message.timeCreated || "").toString();
	const isUsers = message.username === username;

	return (
		<Stack
			flexDirection={"column"}
			className={
				styles.Message +
				" " +
				(isUsers ? styles["Message-Right"] : styles["Message-Left"])
			}>
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
