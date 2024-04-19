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
import Conversation from "../components/Conversation";
import ConversationListItem from "../components/ConversationListItem";
import ConversationModal from "../components/ConversationModal";
import Messenger from "../components/Messenger";
import useConversations from "../hooks/useConversations";
import ConversationServices from "../services/ConversationService";
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
			<ConversationModal
				header={"Create A New Conversation"}
				subheaderWarning={"You can only start conversations with friends"}
				submitButton={"Create Conversation"}
				participantsAction={true}
				titleAction={true}
				action={ConversationServices.create}
				isOpen={addConvoOpen}
				setOpen={addConvoSetOpen}
			/>
			<Box sx={{ width: 270 }} role="presentation" justifyItems={"center"}>
				<List>
					<Button
						variant="contained"
						color={"secondary"}
						size="large"
						sx={{ marginX: "30px", marginY: 2, paddingY: "25px" }}
						onClick={(e) => {
							addConvoSetOpen(true);
							e.stopPropagation();
						}}>
						(+) New Conversation
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
