import {
	Box,
	Button,
	Checkbox,
	Divider,
	IconButton,
	InputBase,
	List,
	ListItem,
	ListItemIcon,
	Modal,
	Stack,
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

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "66%",
	height: "75%",
	bgcolor: "background.default",
	border: "2px solid #000",
	borderRadius: "10px",
	boxShadow: 24,
	p: 6,
	overflowY: "scroll",
};

const AddConversationModal = ({ isOpen, setOpen }: Props) => {
	const theme = useTheme();
	const { register, handleSubmit, setValue } = useForm({
		mode: "onChange",
	});

	const queryClient = useQueryClient();

	const setBanner = useBannerStore((s) => s.setBanner);

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

	return (
		<Modal
			open={isOpen}
			onClose={() => setOpen(false)}
			aria-labelledby="Modal For Finding new friends"
			aria-describedby="Modal that is used for finding new friends on the platform">
			<Box sx={style}>
				<Typography variant="h4" marginBottom={0} component={"h3"}>
					Select the Conversation Member(s)
				</Typography>
				<Typography
					variant="body2"
					paddingBottom={3}
					color={"error"}
					component="p">
					You can only start conversations with friends
				</Typography>
				<Stack
					sx={{
						flexDirection: "row",
						border: `2px double  ${theme.palette.text.primary}`,
						borderRadius: "25px",
						padding: 1,
					}}>
					<InputBase
						sx={{ marginLeft: 1, flex: 1, border: 0 }}
						id="searchContent"
						type="search"
						{...register("searchContent")}
						onChange={(e) => {
							setValue("searchContent", e.target.value);
							handleSubmit(handleSearch)();
						}}
						placeholder="Search For a Friend..."
						inputProps={{ "aria-label": "Search For a Friend!" }}
					/>
					<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
						<SearchIcon />
					</IconButton>
				</Stack>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setParticipants([]);

						const participantUsernames = participants.map((u) => u.username);
						const participantIds = participants.map((u) => u._id);
						if (participantUsernames.length && participantIds.length) {
							await ConversationServices.create({
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
					}}>
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
										<ProfilePicture
											username={u.username}
											base64Image={u.profilePicture}
											pictureType={u.profilePictureType}
										/>
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
