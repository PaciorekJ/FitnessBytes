import AddCircleIcon from "@mui/icons-material/AddCircle";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import {
	Box,
	Button,
	Drawer,
	Grid,
	IconButton,
	List,
	Stack,
	Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useState } from "react";
import AddConversationModal from "../components/AddConversationModal";
import Conversation from "../components/Conversation";
import ConversationListItem from "../components/ConversationListItem";
import Messenger from "../components/Messenger";
import useConversations from "../hooks/useConversations";
import { IMessage } from "../services/MessageServices";

const MessageBoard = () => {
	const { data: conversations } = useConversations();
	const [conversationId, setConversationId] = useState("");
	const [open, setOpen] = useState(true);
	const [newMessage, setNewMessage] = useState<IMessage>({} as IMessage);
	const [addConvoOpen, addConvoSetOpen] = useState(false);

	const queryClient = useQueryClient();

	useEffect(() => {
		if (_.isEmpty(newMessage)) return;
		queryClient.setQueryData(
			[`conversation-${conversationId}`, conversationId],
			(conversation: IMessage[] | undefined) => [
				...(conversation || []),
				newMessage,
			],
		);
	}, [conversationId, newMessage, queryClient]);

	const toggleDrawer = () => setOpen(!open);

	const list = () => (
		<>
			<AddConversationModal isOpen={addConvoOpen} setOpen={addConvoSetOpen} />
			<Box
				sx={{ width: 250 }}
				role="presentation"
				onClick={toggleDrawer}
				onKeyDown={toggleDrawer}
				justifyItems={"center"}>
				<List>
					<Button
						variant="contained"
						color={"secondary"}
						startIcon={<AddCircleIcon />}
						size="large"
						sx={{ ml: 2.5, my: 1 }}
						onClick={(e) => {
							addConvoSetOpen(true);
							e.stopPropagation();
						}}>
						New Conversation
					</Button>
					{conversations &&
						conversations.map((c) => (
							<ConversationListItem
								key={c._id}
								{...c}
								conversationId={conversationId}
								setOpen={setOpen}
								setConversationId={setConversationId}
							/>
						))}
				</List>
			</Box>
		</>
	);

	return (
		<>
			<Box position={"sticky"} top={"10vh"} left={0}>
				<IconButton
					size="large"
					sx={{
						"bgcolor": "background.default",
						"borderRadius": "0 50px 50px 0",
						"&:hover": {
							bgcolor: "background.default",
						},
					}}
					onClick={toggleDrawer}>
					<RecentActorsIcon fontSize={"large"} color="primary" />
				</IconButton>
			</Box>
			<Grid padding={2} width={"100%"} height={"100%"} container columns={5}>
				<Grid item xs={0}>
					<Drawer anchor={"left"} open={open} onClose={toggleDrawer}>
						{list()}
					</Drawer>
				</Grid>
				<Grid item xs={5}>
					{(conversationId && (
						<Stack
							minHeight={"78vh"}
							maxWidth={"800px"}
							marginX={"auto"}
							justifyContent={"end"}>
							{conversations && (
								<Conversation conversationId={conversationId} />
							)}
							<Messenger
								setNewMessage={setNewMessage}
								conversationId={conversationId}
							/>
						</Stack>
					)) || (
						<Typography align={"center"} color={"text.disabled"}>
							No Conversation Selected
						</Typography>
					)}
				</Grid>
			</Grid>
		</>
	);
};

export default MessageBoard;
