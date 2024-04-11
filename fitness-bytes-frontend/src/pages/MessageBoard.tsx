import AddCircleIcon from "@mui/icons-material/AddCircle";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import {
	Box,
	Button,
	CircularProgress,
	Drawer,
	IconButton,
	List,
	Stack,
	Typography,
} from "@mui/material";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect, useState } from "react";
import AddConversationModal from "../components/AddConversationModal";
import Conversation from "../components/Conversation";
import ConversationListItem from "../components/ConversationListItem";
import Messenger from "../components/Messenger";
import useConversations from "../hooks/useConversations";
import { IMessage } from "../services/MessageServices";

const MessageBoard = () => {
	const { data: conversations, isLoading } = useConversations();
	const [conversationId, setConversationId] = useState("");
	const [open, setOpen] = useState(true);
	const [newMessage, setNewMessage] = useState<IMessage>({} as IMessage);
	const [addConvoOpen, addConvoSetOpen] = useState(false);

	const queryClient = useQueryClient();

	useEffect(() => {
		queryClient.setQueryData(
			[`messages-${conversationId}`, conversationId],
			(oldConversations: InfiniteData<IMessage[] | undefined> | undefined) => {
				if (!newMessage || _.isEmpty(newMessage)) {
					return oldConversations || { pageParams: 0, pages: [] };
				}

				const oldPages = oldConversations?.pages || [];

				const updatedPages =
					oldPages.length > 0
						? [[newMessage, ...(oldPages[0] || [])], ...oldPages.slice(1)]
						: [[newMessage]];

				return {
					...oldConversations,
					pages: updatedPages,
				};
			},
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
				</List>
			</Box>
		</>
	);

	return (
		<>
			<Drawer anchor={"left"} open={open} onClose={toggleDrawer}>
				{list()}
			</Drawer>
			<Box position={"absolute"} top={"12vh"} left={0}>
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
			{(conversationId && (
				<>
					<Conversation conversationId={conversationId} />
					<Messenger
						conversationId={conversationId}
						setNewMessage={setNewMessage}
					/>
				</>
			)) || (
				<Typography
					position={"absolute"}
					top={"45%"}
					width={"100%"}
					align={"center"}
					color={"text.disabled"}>
					No Conversation Selected
				</Typography>
			)}
		</>
	);
};

export default MessageBoard;
