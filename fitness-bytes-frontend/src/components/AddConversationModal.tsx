import {
	Avatar,
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
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import User from "../interfaces/User";

import SearchIcon from "@mui/icons-material/Search";
import { useQueryClient } from "@tanstack/react-query";
import ClientService from "../services/HTTP-Services/ClientService";

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

	const [searchResults, setSearchResults] = useState<User[]>([]);
	const [participants, setParticipants] = useState<User[]>([]);

	const toggleParticipants = (user: User) => {
		const newParticipants: User[] = [];
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
		const q = data.searchContent || "";
		const reqConfig = {
			params: {
				query: q,
			},
		};

		const client = new ClientService<User[]>("/friend/");
		const { result: users } = await client.get(reqConfig);
		setSearchResults(users || []);
	}

	return (
		<Modal
			open={isOpen}
			onClose={() => setOpen(false)}
			aria-labelledby="Modal For Finding new friends"
			aria-describedby="Modal that is used for finding new friends on the platform">
			<Box sx={style}>
				<Typography variant="h3" paddingBottom={3}>
					Select the Conversation Member(s)
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
						console.log(participants);
						setParticipants([]);

						const client = new ClientService("/conversation/");

						const participantsUsernames = participants.map((u) => u.username);
						await client.post({
							participants: participantsUsernames,
							messageContent: "Hey Everyone",
						});

						queryClient.invalidateQueries({queryKey: ["conversations"]});
						setOpen(false);
					}}>
					<Button type="submit">Create Conversation</Button>
					<List>
						{searchResults.map((u: User, i) => (
							<React.Fragment key={"Search__Result-" + u.username + " " + i}>
								<ListItemIcon>
									<Avatar>{u.username.charAt(0)}</Avatar>
								</ListItemIcon>
								<ListItem>
									<Typography>{u.username}</Typography>
								</ListItem>
								<Checkbox onClick={() => toggleParticipants(u)} />
								<Divider />
							</React.Fragment>
						))}
					</List>
				</form>
			</Box>
		</Modal>
	);
};

export default AddConversationModal;
