import { Stack } from "@mui/material";
import { useEffect, useRef } from "react";
import useUserStore from "../hooks/useUserStore";
import { User } from "../pages/MessageBoard";
import Message from "./Message";

interface Props {
	conversation: string; // User of the selected conversation
	conversations: User[];
}

const Conversation = ({
	conversation: selectedConversation,
	conversations,
}: Props) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const user = useUserStore();
	console.log(user);

	const conversation = conversations.find(
		(c) => c.username === selectedConversation,
	);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView();
	}, [conversation]);

	return (
		<>
			<Stack gap={2}>
				{conversation?.messages?.map((m, i) => {
					return <Message key={"Conversation__Messages-" + i} message={m} />;
				})}
			</Stack>
			<div ref={messagesEndRef}></div>
		</>
	);
};

export default Conversation;
