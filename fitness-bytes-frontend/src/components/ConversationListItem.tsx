import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import {
	Avatar,
	Box,
	CircularProgress,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
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
				<Box
					bgcolor={_id === conversationId ? theme.palette.primary.light : ""}
					color={_id === conversationId ? "white" : ""}>
					<ListItem
						disablePadding
						secondaryAction={
							processingDelete ? (
								<Stack margin={0.5}>
									<CircularProgress size={"1rem"} />
								</Stack>
							) : (
								<IconButton
									onClick={(e) => {
										e.stopPropagation();
										setOpen(true);
										deleteConversation(_id);
									}}
									edge="end"
									aria-label="delete">
									<DeleteTwoToneIcon />
								</IconButton>
							)
						}>
						<ListItemButton
							onClick={() => {
								SocketServices.leave(conversationId);
								setConversationId(_id);
								SocketServices.join(_id);
							}}>
							<ListItemIcon>
								<Avatar aria-label="User Icon">{convoTitle.charAt(0)}</Avatar>
							</ListItemIcon>
							<ListItemText primary={convoTitle} />
						</ListItemButton>
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
