/* eslint-disable no-mixed-spaces-and-tabs */
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
	Box,
	Divider,
	IconButton,
	InputBase,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	Modal,
	Stack,
	Tooltip,
	Typography,
	useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useBannerStore from "../hooks/useBannerStore";
import useUsers from "../hooks/useUsers";
import FriendRequestServices from "../services/FriendRequestServices";
import { IUser } from "../services/UserServices";
import PageSpinner from "./PageSpinner";
import ProfilePicture from "./ProfilePicture";

const AddFriend = () => {
	const { register, reset, setValue } = useForm({
		mode: "onChange",
	});

	const [isOpen, setOpen] = useState(false);
	const setBanner = useBannerStore((s) => s.setBanner);
	const theme = useTheme();

	const [searchTerm, setSearchTerm] = useState("");
	const { data, isLoading } = useUsers(searchTerm, true);

	const client = useQueryClient();

	const searchResultsPages = data?.pages || [[]];

	useEffect(() => {
		client.invalidateQueries({ queryKey: [`userSearch`] });
	}, [client, searchTerm]);

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

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

	const handleAddFriend = async (_id: string, toUsername: string) => {
		const friendRequest = await FriendRequestServices.create(_id);

		if (friendRequest) {
			setBanner(`Friend Request has been sent to ${toUsername}`);
		} else {
			setBanner(
				`Friend Request could not be send. A friend request is already pending or you guys are already friends`,
				true,
			);
		}
	};

	return (
		<>
			<Tooltip title="Add a Friend">
				<IconButton onClick={openModal}>
					<PersonAddOutlinedIcon color="primary" />
				</IconButton>
			</Tooltip>
			<Modal
				open={isOpen}
				onClose={closeModal}
				aria-labelledby="Modal For Finding new friends"
				aria-describedby="Modal that is used for finding new friends on the platform">
				<Box sx={style}>
					<Typography variant="h4" marginBottom={0} component={"h3"}>
						Search for a Friend
					</Typography>
					<Typography
						variant="body2"
						paddingBottom={3}
						color={"secondary.light"}
						component="p">
						Please enter their username
					</Typography>
					<Stack
						sx={{
							flexDirection: "row",
							border: `2px double  ${theme.palette.text.primary}`,
							borderRadius: "25px",
							padding: 0.5,
						}}>
						<InputBase
							sx={{ marginLeft: 1, flex: 1, border: 0 }}
							id="searchContent"
							type="search"
							{...register("searchContent")}
							onChange={(e) => {
								setValue("searchContent", e.target.value);
								setSearchTerm(e.target.value);
							}}
							placeholder="Search For a Friend..."
							inputProps={{ "aria-label": "Search For a Friend!" }}
						/>
						<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Stack>
					<List>
						{isLoading ? (
							<PageSpinner margin={"2rem"} />
						) : searchResultsPages.reduce(
								(acc, searchResultPage) =>
									(acc += (searchResultPage || []).length),
								0,
						  ) ? (
							searchResultsPages.map((searchResultPage, i) => (
								<React.Fragment key={"SEARCH-RESULT-USERS-" + i}>
									{searchResultPage &&
										searchResultPage.map((u: IUser, j) => (
											<ListItem key={"Search__Result- " + j}>
												<ListItemButton href={"/auth/account/" + u.username}>
													<Stack flexDirection={"row"}>
														<ProfilePicture username={u.username} />
														<ListItem>
															<Typography>{u.username}</Typography>
														</ListItem>
													</Stack>
													<ListItemIcon sx={{ marginLeft: "auto" }}>
														<IconButton
															onClick={(e) => {
																e.preventDefault();
																closeModal();
																setSearchTerm("");
																reset();
																handleAddFriend(u._id, u.username);
															}}>
															<PersonAddOutlinedIcon color="primary" />
														</IconButton>
													</ListItemIcon>
												</ListItemButton>
												<Divider />
											</ListItem>
										))}
								</React.Fragment>
							))
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
					</List>
				</Box>
			</Modal>
		</>
	);
};

export default AddFriend;
