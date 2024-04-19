import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import ModeTwoToneIcon from "@mui/icons-material/ModeTwoTone";
import {
	Avatar,
	Box,
	CircularProgress,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	Stack,
	useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import ConversationServices, {
	IConversation,
} from "../services/ConversationService";
import NotificationServices from "../services/NotificationServices";
import SocketServices from "../services/SocketServices";
import ConversationModal from "./ConversationModal";

interface ConversationListItemProps extends IConversation {
	conversationId: string;
	setConversationId: (id: string) => void;
	setOpen: (open: boolean) => void;
}

const ConversationListItem = ({
	title,
	participantUsernames,
	_id,
	conversationId,
	setConversationId,
	setOpen,
}: ConversationListItemProps) => {
	const convoTitle =
		title || participantUsernames.join(", ") || "Empty Conversation";
	const [processingDelete, setProcessingDelete] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const queryClient = useQueryClient();
	const theme = useTheme();

	const deleteConversation = async (id: string) => {
		if (processingDelete) return;
		setProcessingDelete(true);

		await ConversationServices.delete(id);
		if (id === conversationId) {
			setConversationId("");
			SocketServices.leave(id);
		}

		await NotificationServices.deleteByConversation(id);

		queryClient.setQueryData<IConversation[] | undefined>(
			["conversations"],
			(oldConversations: IConversation[] | undefined) =>
				oldConversations?.filter((c) => c._id !== id) || [],
		);

		setProcessingDelete(false);
	};
	return (
		(
			<React.Fragment key={convoTitle + "/" + _id}>
				<ConversationModal
					_id={_id}
					header={`Update the "${convoTitle}" Conversation`}
					subheaderWarning={"You can only have conversations with friends"}
					submitButton={"Update Conversation"}
					participantsAction={true}
					titleAction={true}
					action={ConversationServices.update}
					isOpen={editModalOpen}
					setOpen={setEditModalOpen}
				/>
				<Box
					bgcolor={_id === conversationId ? theme.palette.primary.light : ""}
					color={_id === conversationId ? "white" : ""}>
					<ListItem disablePadding={true}>
						<ListItemButton
							onClick={() => {
								SocketServices.leave(conversationId);
								setConversationId(_id);
								SocketServices.join(_id);
								setOpen(false);
							}}>
							<Stack flexDirection={"row"}>
								<ListItemIcon>
									<Avatar aria-label="User Icon">{convoTitle.charAt(0)}</Avatar>
								</ListItemIcon>
								<ListItemText
									primary={convoTitle}
									sx={{
										paddingRight: "40px",
									}}
								/>
							</Stack>
						</ListItemButton>
						<ListItemSecondaryAction>
							{processingDelete ? (
								<Stack gap={1} flexDirection={"row"} alignItems={"center"}>
									<IconButton
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setOpen(true);
											setEditModalOpen(true);
										}}
										edge="end"
										aria-label="edit conversation name">
										<ModeTwoToneIcon />
									</IconButton>
									<CircularProgress sx={{ marginLeft: 1 }} size={"1rem"} />
								</Stack>
							) : (
								<Stack gap={1} flexDirection={"row"} alignItems={"center"}>
									<IconButton
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setOpen(true);
											setEditModalOpen(true);
										}}
										edge="end"
										aria-label="edit conversation">
										<ModeTwoToneIcon />
									</IconButton>
									<IconButton
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setOpen(true);
											deleteConversation(_id);
										}}
										edge="end"
										aria-label="delete">
										<DeleteTwoToneIcon />
									</IconButton>
								</Stack>
							)}
						</ListItemSecondaryAction>
					</ListItem>
				</Box>
			</React.Fragment>
		) || (
			<Stack width={"100%"} alignItems={"center"}>
				<CircularProgress />
			</Stack>
		)
	);
};

export default ConversationListItem;
