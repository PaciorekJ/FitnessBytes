import { CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import useConversation from "../hooks/useConversation";
import { IMessage } from "../services/MessageServices";
import Message from "./Message";

interface Props {
	conversationId: string; // User of the selected conversation
}

const Conversation = ({ conversationId }: Props) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data, isLoading } = useConversation(conversationId);
	const conversation: IMessage[] = data || [];

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [conversationId, data]);

	return (
		<>
			{isLoading && (
				<Stack
					sx={{
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "start",
						margin: "auto",
					}}>
					<CircularProgress color="secondary" />
				</Stack>
			)}
			{!isLoading && !conversation.length && (
				<Stack
					sx={{
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "start",
						margin: "auto",
					}}>
					<Typography variant="body2" color={"text.disabled"} component="h3">
						Go on, send the first message
					</Typography>
					😁
				</Stack>
			)}
			<Stack gap={2}>
				{conversation.map((m, i) => {
					return <Message key={"Conversation__Messages-" + i} message={m} />;
				})}
			</Stack>
			<div ref={messagesEndRef}></div>
		</>
	);
};

export default Conversation;
