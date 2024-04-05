/* eslint-disable no-mixed-spaces-and-tabs */
import CloseIcon from "@mui/icons-material/Close";
import {
	Alert,
	Box,
	Button,
	Checkbox,
	Divider,
	IconButton,
	ListItem,
	ListItemIcon,
	Modal,
	Stack,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

import SearchIcon from "@mui/icons-material/Search";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useBannerStore from "../hooks/useBannerStore";
import useUserFriends from "../hooks/useUserFriends";
import ConversationServices from "../services/ConversationService";
import { IUser } from "../services/UserServices";
import PageSpinner from "./PageSpinner";
import ProfilePicture from "./ProfilePicture";

interface Props {
	isOpen: boolean;
	setOpen: (status: boolean) => void;
}

const AddConversationModal = ({ isOpen, setOpen }: Props) => {
	const theme = useTheme();
	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		mode: "onChange",
	});
	const queryClient = useQueryClient();

	const [searchTerm, setSearchTerm] = useState("");
	const { data, hasNextPage, fetchNextPage, isLoading } =
		useUserFriends(searchTerm);
	const searchResultsPages = data?.pages || [[]];

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: [`userSearch`] });
	}, [queryClient, searchTerm]);

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
	};

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
							setSearchTerm(e.target.value);
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
					<Stack
						id="addParticipantContainer"
						sx={{
							"marginTop": 2,
							"height": "20vh",
							"@media (max-width: 768px) and (orientation: landscape)": {
								height: "20vh",
							},
							"overflowY": "auto",
							"display": "flex",
							"flexDirection": "column",
						}}>
						{isLoading ? (
							<PageSpinner margin={"3rem"} />
						) : searchResultsPages.reduce(
								(acc, searchResultPage) =>
									acc + (searchResultPage?.length || 0),
								0,
						  ) > 0 ? (
							<InfiniteScroll
								hasMore={hasNextPage}
								loader={<PageSpinner />}
								scrollableTarget={"addParticipantContainer"}
								next={fetchNextPage}
								dataLength={searchResultsPages.reduce(
									(acc, searchResultPage) =>
										acc + (searchResultPage?.length || 0),
									0,
								)}>
								{searchResultsPages.map((searchResultPage, i) => (
									<React.Fragment key={"SEARCH-RESULT-USERS-FRIENDS" + i}>
										{searchResultPage?.map((u: IUser, j) => (
											<Stack
												sx={{
													flexDirection: "row",
													padding: 1,
												}}
												key={"Search__Result-Friend" + u.username + " " + j}>
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
										))}
									</React.Fragment>
								))}
							</InfiniteScroll>
						) : (
							<ListItem sx={{ justifyContent: "center" }}>
								<Typography
									margin={"3rem"}
									component={"p"}
									color={"text.disabled"}>
									No Results
								</Typography>
							</ListItem>
						)}
					</Stack>
				</form>
			</Box>
		</Modal>
	);
};

export default AddConversationModal;
