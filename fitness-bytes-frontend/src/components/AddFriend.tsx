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
import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { FieldValues, useForm } from "react-hook-form";
import useBannerStore from "../hooks/useBannerStore";
import FriendRequestServices from "../services/FriendRequestServices";
import UserServices, { IUser } from "../services/UserServices";
import ProfilePicture from "./ProfilePicture";

const AddFriend = () => {
	const [isOpen, setOpen] = useState(false);
	const [searchResults, setSearchResults] = useState<IUser[]>([]);
	const setBanner = useBannerStore((s) => s.setBanner);
	const theme = useTheme();

	const { register, handleSubmit, setValue, reset } = useForm({
		mode: "onChange",
	});

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

	async function handleSearch(data: FieldValues) {
		const users = await UserServices.search(data.searchContent, true);

		setSearchResults(users || []);
	}

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
					<Typography variant="h4" component="h3" paddingBottom={3}>
						Find A Friend
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
								handleSubmit(handleSearch)();
							}}
							placeholder="Search For a Friend..."
							inputProps={{ "aria-label": "Search For a Friend!" }}
						/>
						<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Stack>
					<List>
						{searchResults.length ? (
							searchResults.map((u: IUser, i) => (
								<ListItem key={"Search__Result-" + u.profilePicture + " " + i}>
									<ListItemButton href={"/auth/account/" + u.username}>
										<Stack flexDirection={"row"}>
											<ProfilePicture
												username={u.username}
												base64Image={u.profilePicture || ""}
												pictureType={u.profilePictureType || ""}
											/>
											<ListItem>
												<Typography>{u.username}</Typography>
											</ListItem>
										</Stack>
										<ListItemIcon sx={{ marginLeft: "auto" }}>
											<IconButton
												onClick={(e) => {
													e.preventDefault();
													closeModal();
													setSearchResults([]);
													reset();
													handleAddFriend(u._id, u.username);
												}}>
												<PersonAddOutlinedIcon color="primary" />
											</IconButton>
										</ListItemIcon>
									</ListItemButton>
									<Divider />
								</ListItem>
							))
						) : (
							<ListItem sx={{ justifyContent: "center" }}>
								<Typography component={"p"} color={"text.disabled"}>
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
