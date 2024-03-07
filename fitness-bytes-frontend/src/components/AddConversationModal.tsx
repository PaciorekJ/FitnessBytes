import {
	Avatar,
	Box,
	Checkbox,
	Divider,
	IconButton,
	InputBase,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	Modal,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import users from "../data/user";
import User from "../interfaces/User";

import SearchIcon from "@mui/icons-material/Search";
import ClientService from "../services/ClientService";

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
	const { register, handleSubmit, setValue, reset } = useForm({
		mode: "onChange",
	});
	const [searchResults, setSearchResults] = useState<User[]>([]);

	async function handleSearch(data: FieldValues) {
		// const reqConfig = {
		// 	params: {
		// 		query: data.searchContent,
		// 	},
		// };

		const client = new ClientService<User[]>("/friend/");

		const { result: users } = await client.get();

		setSearchResults(users || []);

		console.log(data.searchContent);
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
				<List>
					{searchResults.map((u: User, i) => (
						<React.Fragment key={"Search__Result-" + u.username + " " + i}>
							<ListItemButton href={"/auth/account/" + u.username}>
								<ListItemIcon>
									<Avatar>{u.username.charAt(0)}</Avatar>
								</ListItemIcon>
								<ListItem>
									<Typography>{u.username}</Typography>
								</ListItem>
								<Checkbox 
                                value={`${u.username}-${u._id}`}
                                />
							</ListItemButton>
							{i < users.length - 1 && <Divider />}
						</React.Fragment>
					))}
				</List>
			</Box>
		</Modal>
	);
};

export default AddConversationModal;
