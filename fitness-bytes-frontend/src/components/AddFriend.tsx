import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {
	Avatar,
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
	useTheme
} from "@mui/material";
import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { User } from "../pages/MessageBoard";

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
	p: 4,
};

const users: User[] = [
	{
		username: "Dave",
	},
	{
		username: "Paul",
	},
	{
		username: "Bruce",
	},
	{
		username: "Alice",
	},
	{
		username: "John",
	},
	{
		username: "Karen",
	},
	{
		username: "Steve",
	},
	{
		username: "Rachel",
	},
	{
		username: "Michael",
	},
	{
		username: "Linda",
	},
	{
		username: "Robert",
	},
	{
		username: "Jennifer",
	},
	{
		username: "William",
	},
	{
		username: "Patricia",
	},
	{
		username: "Charles",
	},
];

const handleAddFriend = () => {};

const AddFriend = () => {
	const [isOpen, setOpen] = useState(false);
	const [searchResults, setSearchResults] = useState<User[]>([]);

	const theme = useTheme();

	const { register, handleSubmit, setValue, reset } = useForm({
		mode: "onChange",
	});

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	function handleSearch(data: FieldValues) {
		const results =
			data.searchContent !== ""
				? users.filter((u) =>
					u.username.toLowerCase().match(data.searchContent.toLowerCase()),
				)
				: [];
		setSearchResults(results);
		console.log(data.searchContent);
	}

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
				aria-labelledby="Modal For Posting"
				aria-describedby="Modal that is used for posting on the platform">
				<Box sx={style}>
					<Stack
						flexDirection={"row"}
						border={"2px double " + theme.palette.text.primary}
						borderRadius={"25px"}
						padding={1}>
						<InputBase
							sx={{ ml: 1, flex: 1, border: 0 }}
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
						{searchResults.map((u, i) => (
							<React.Fragment key={"Search__Result-" + u.username + " " + i}>
								<ListItemButton>
									<ListItemIcon>
										<Avatar>{u.username.charAt(0)}</Avatar>
									</ListItemIcon>
									<ListItem>
										<Typography>{u.username}</Typography>
									</ListItem>
									<ListItemIcon>
										<IconButton
											onClick={(e) => {
												e.preventDefault();
												closeModal();
												setSearchResults([]);
												reset();
												handleAddFriend();
											}}>
											<PersonAddOutlinedIcon color="primary" />
										</IconButton>
									</ListItemIcon>
								</ListItemButton>
								{i < users.length - 1 && <Divider />}
							</React.Fragment>
						))}
					</List>
				</Box>
			</Modal>
		</>
	);
};

export default AddFriend;
