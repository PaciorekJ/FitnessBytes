import SearchIcon from "@mui/icons-material/Search";
import {
	Box,
	Button,
	Checkbox,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	Modal,
	Stack,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import useBannerStore from "../hooks/useBannerStore";
import useConversation from "../hooks/useConversation";
import ConversationServices from "../services/ConversationService";
import FriendServices from "../services/FriendServices";
import { IUser } from "../services/UserServices";
import ProfilePicture from "./ProfilePicture";

interface ModalProps {
	conversationId: string;
	isOpen: boolean;
	setOpen: (b: boolean) => void;
}

const AddParticipantsModal = ({
	isOpen,
	setOpen,
	conversationId,
}: ModalProps) => {
	const theme = useTheme();
	const [searchResults, setSearchResults] = useState<IUser[]>([]);
	const [participants, setParticipants] = useState<IUser[]>([]);
	const { data: conversation, isLoading } = useConversation(conversationId);
	const setBanner = useBannerStore((s) => s.setBanner);
	const queryClient = useQueryClient();
	const { register, handleSubmit, setValue } = useForm({
		mode: "onChange",
	});
	const [resetVal, setReset] = useState(false);
	const reset = () => setReset(resetVal);

	useEffect(() => {
		if (isLoading && !conversation) {
			setParticipants([]);
			return;
		}

		if (!conversation) return;

		const newParticipants =
			conversation.participantIds?.map((id, i) => ({
				_id: id,
				username: conversation.participantUsernames[i],
				bio: "",
				profilePicture: "",
				profilePictureType: "",
			})) || [];

		setParticipants(newParticipants);
	}, [
		conversation,
		conversation?.participantIds,
		conversation?.participantUsernames,
		isLoading,
		resetVal,
	]);

	async function handleSearch(data: FieldValues) {
		const users = await FriendServices.search(data.searchContent || "");
		setSearchResults(users || []);
	}

	async function handleUpdateConversation() {
		const participantUsernames = participants.map((u) => u.username);
		const participantIds = participants.map((u) => u._id);

		if (participantUsernames.length && participantIds.length) {
			await ConversationServices.updateParticipants({
				_id: conversationId,
				participantUsernames,
				participantIds,
			});
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		} else {
			setBanner(
				"You must have 2 or more participant's in a conversation",
				true,
			);
		}

		setOpen(false);
	}

	const toggleParticipants = (user: IUser) => {
		const newParticipants: IUser[] = [];
		let present = false;
		participants.forEach((p) => {
			if (p._id !== user._id || p.username !== user.username) {
				newParticipants.push(p);
			} else {
				present = true;
			}
		});

		if (!present) {
			newParticipants.push(user);
		}
		setParticipants(newParticipants || []);
	};

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: { xs: "98%", lg: "66%" },
		height: "75%",
		bgcolor: "background.default",
		border: "2px solid #000",
		borderRadius: "25px",
		boxShadow: "0px 0px 10vh " + theme.palette.primary.light,
		p: 3,
		overflowY: "scroll",
	};

	return (
		<Modal
			open={isOpen}
			onClose={() => {
				setOpen(false);
				reset();
			}}
			aria-labelledby="Modal For Adding participants"
			aria-describedby="Modal For Adding participants to your current conversation">
			<Box sx={style}>
				<TextField
					sx={{ width: "100%" }}
					label={"Search for Participants"}
					color={"secondary"}
					focused
					type="input"
					id="searchContent"
					{...register("searchContent")}
					onChange={(e) => {
						setValue("searchContent", e.target.value);
						handleSubmit(handleSearch)();
					}}
					placeholder="Search for Participants..."
					InputProps={{
						"aria-label": "Search For a Friend!",
						"endAdornment": (
							<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
								<SearchIcon />
							</IconButton>
						),
					}}
				/>
				<form onSubmit={handleSubmit(handleUpdateConversation)}>
					<Stack margin={2}>
						<Button type="submit" color="secondary" variant="contained">
							Update conversation Participants
						</Button>
					</Stack>
					<List>
						{searchResults.length ? (
							searchResults.map((u: IUser, i) => (
								<Stack
									sx={{
										flexDirection: "row",
										padding: 1,
									}}
									key={"Search__Result-" + u.username + " " + i}>
									<ListItemIcon>
										<ProfilePicture username={u.username} />
									</ListItemIcon>
									<ListItem>
										<Typography>{u.username}</Typography>
									</ListItem>
									<Checkbox
										onClick={() => toggleParticipants(u)}
										checked={participants.some(
											(p) => p.username === u.username,
										)}
									/>
									<Divider />
								</Stack>
							))
						) : (
							<ListItem sx={{ justifyContent: "center" }}>
								<Typography component={"p"} color={"text.disabled"}>
									No Results
								</Typography>
							</ListItem>
						)}
					</List>
				</form>
			</Box>
		</Modal>
	);
};

export default AddParticipantsModal;
