import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import {
	Avatar,
	Box,
	Button,
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
import React, { useState } from "react";
import AddConversationModal from "../components/AddConversationModal";
import Conversation from "../components/Conversation";
import Messenger from "../components/Messenger";
import useConversations from "../hooks/useConversations";
import ConversationService from "../services/ConversationService";

const MessageBoard = () => {
	const { data } = useConversations();
	const [conversationId, setConversationId] = useState("");
	const [open, setOpen] = useState(true);
	const [addConvoOpen, addConvoSetOpen] = useState(false);
	const theme = useTheme();

	const queryClient = useQueryClient();

	const conversations = data?.result;

	const toggleDrawer = () => setOpen(!open);

	const deleteConversation = async (id: string) => {
		await ConversationService.delete(id);

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
					{conversations &&
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
											<ListItemButton onClick={() => setConversationId(c._id)}>
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
						})}
				</List>
			</Box>
		</>
	);

	return (
		<>
			<Box position={"sticky"} bgcolor={"background.default"} top={0} left={0}>
				<IconButton onClick={toggleDrawer}>
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
						<Stack minHeight={"78vh"} justifyContent={"end"}>
							{conversations && (
								<Conversation conversationId={conversationId} />
							)}
							<Messenger conversationId={conversationId} />
						</Stack>
					)) || (
						<Typography align={"center"}>No Conversation Selected</Typography>
					)}
				</Grid>
			</Grid>
		</>
	);
};

export default MessageBoard;
