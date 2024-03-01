import { Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import useConversation from "../hooks/useConversation";
import IMessage from "../interfaces/Message";
import Message from "./Message";

interface Props {
	conversationId: string; // User of the selected conversation
}

const Conversation = ({ conversationId }: Props) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data } = useConversation(conversationId);
	const conversation: IMessage[] = data?.result || [];

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView();
	}, [conversationId, data]);

	return (
		<>
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
