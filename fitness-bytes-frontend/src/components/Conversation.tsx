import { Stack } from "@mui/material";
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
	const conversation = conversations.find(
		(c) => c.username === selectedConversation,
	);

	return (
		<Stack>
			<Stack gap={2}>
				{conversation?.messages?.map((m) => {
					return <Message message={m} />;
				})}
			</Stack>
		</Stack>
	);
};

export default Conversation;
