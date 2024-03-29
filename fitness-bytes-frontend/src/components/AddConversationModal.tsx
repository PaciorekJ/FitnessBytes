import CloseIcon from "@mui/icons-material/Close";
import {
	Alert,
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
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import SearchIcon from "@mui/icons-material/Search";
import { useQueryClient } from "@tanstack/react-query";
import useBannerStore from "../hooks/useBannerStore";
import ConversationServices from "../services/ConversationService";
import FriendServices from "../services/FriendServices";
import { IUser } from "../services/UserServices";
import ProfilePicture from "./ProfilePicture";

interface Props {
	isOpen: boolean;
	setOpen: (status: boolean) => void;
}

const AddConversationModal = ({ isOpen, setOpen }: Props) => {
	const theme = useTheme();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		mode: "onChange",
	});

	const queryClient = useQueryClient();

	const setBanner = useBannerStore((s) => s.setBanner);
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

	const [searchResults, setSearchResults] = useState<IUser[]>([]);
	const [participants, setParticipants] = useState<IUser[]>([]);

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

	async function handleSearch(data: FieldValues) {
		const users = await FriendServices.search(data.searchContent || "");
		setSearchResults(users || []);
	}

	async function handleCreateConversation(data: FieldValues) {
		setParticipants([]);

		const participantUsernames = participants.map((u) => u.username);
		const participantIds = participants.map((u) => u._id);
		const title = data.title;

		if (participantUsernames.length && participantIds.length) {
			await ConversationServices.create({
				participantUsernames,
				participantIds,
				title,
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

	return (
		<Modal
			open={isOpen}
			onClose={() => setOpen(false)}
			aria-labelledby="Modal For Finding new friends"
			aria-describedby="Modal that is used for finding new friends on the platform">
			<Box sx={style}>
				<Stack marginBottom={1}>
					<Typography variant="h4" marginBottom={0} component={"h3"}>
						Create A New Conversation
					</Typography>
					<Typography variant="body2" color={"error"} component="p">
						You can only start conversations with friends
					</Typography>
					<Typography
						variant="body2"
						paddingBottom={3}
						color={"secondary"}
						component="p">
						Conversation titles are optional
					</Typography>
				</Stack>
				<Stack gap={2}>
					{errors && errors.title && (
						<Alert icon={<CloseIcon />} color="warning">
							{errors.title.message?.toString()}
						</Alert>
					)}
					<TextField
						sx={{ width: "100%" }}
						id="title"
						focused
						label={"Conversation Title"}
						color={"secondary"}
						type="input"
						{...register("title", {
							maxLength: {
								value: 20,
								message: "Max Length for a Title is 20 characters",
							},
						})}
						placeholder="Conversation Title..."
						inputProps={{
							"aria-label": "Conversation Title",
						}}
					/>
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
								<IconButton
									type="button"
									sx={{ p: "10px" }}
									aria-label="search">
									<SearchIcon />
								</IconButton>
							),
						}}
					/>
				</Stack>
				<form onSubmit={handleSubmit(handleCreateConversation)}>
					<Stack margin={2}>
						<Button type="submit" color="secondary" variant="contained">
							Create Conversation
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

export default AddConversationModal;
