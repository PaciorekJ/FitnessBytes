import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Divider,
	Drawer,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import AddConversationModal from "../components/AddConversationModal";
import Conversation from "../components/Conversation";
import Messenger from "../components/Messenger";
import useConversations from "../hooks/useConversations";
import ConversationServices from "../services/ConversationService";
import { IMessage } from "../services/MessageServices";
import SocketServices from "../services/SocketServices";

const MessageBoard = () => {
	const { data: conversations } = useConversations();
	const [conversationId, setConversationId] = useState("");
	const [open, setOpen] = useState(true);
	const [newMessage, setNewMessage] = useState<IMessage>({} as IMessage);
	const [addConvoOpen, addConvoSetOpen] = useState(false);
	const theme = useTheme();

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

	const deleteConversation = async (id: string) => {
		await ConversationServices.delete(id);

		if (id === conversationId) {
			setConversationId("");
			SocketServices.leave(id);
		}
		queryClient.invalidateQueries({ queryKey: ["conversations"] });
	};

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
					{(conversations &&
						conversations.map((c, i) => {
							const convoTitle =
								c.title || c.participants.join(", ") || "Empty Conversation";
							return (
								<React.Fragment key={"Contact__" + convoTitle + "-" + i}>
									<Box
										bgcolor={
											c._id === conversationId
												? theme.palette.primary.light
												: ""
										}
										color={c._id === conversationId ? "white" : ""}>
										<ListItem
											disablePadding
											secondaryAction={
												<IconButton
													onClick={(e) => {
														e.stopPropagation();
														setOpen(true);
														deleteConversation(c._id);
													}}
													edge="end"
													aria-label="delete">
													<DeleteIcon />
												</IconButton>
											}>
											<ListItemButton
												onClick={() => {
													SocketServices.leave(conversationId);
													setConversationId(c._id);
													SocketServices.join(c._id);
												}}>
												<ListItemIcon>
													<Avatar aria-label="User Icon">
														{convoTitle.charAt(0)}
													</Avatar>
												</ListItemIcon>
												<ListItemText primary={convoTitle} />
											</ListItemButton>
										</ListItem>
									</Box>
									{i < conversations.length - 1 && <Divider />}
								</React.Fragment>
							);
						})) || (
						<Stack width={"100%"} alignItems={"center"}>
							<CircularProgress />
						</Stack>
					)}
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
						<Stack minHeight={"78vh"} maxWidth={"800px"} marginX={"auto"} justifyContent={"end"}>
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
