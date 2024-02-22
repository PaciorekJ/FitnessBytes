import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import {
	Avatar,
	Box,
	Button,
	Divider,
	Drawer,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Conversation from "../components/Conversation";
import Messenger from "../components/Messenger";

export interface IMessage {
	username: string;
	content: string;
	timeCreated?: Date;
}

export interface User {
	username: string;
	messages?: IMessage[];
}

const conversations: User[] = [
	{
		username: "Dave",
		messages: [
			{
				username: "Dave",
				content: "Hey",
				timeCreated: new Date(),
			},
			{
				username: "Dave",
				content: "HEY",
				timeCreated: new Date(),
			},
			{
				username: "Jason",
				content: "hey",
				timeCreated: new Date(),
			},
			{
				username: "Dave",
				content: "Hey",
				timeCreated: new Date(),
			},
			{
				username: "Dave",
				content: "HEY",
				timeCreated: new Date(),
			},
			{
				username: "Jason",
				content: "hey",
				timeCreated: new Date(),
			},
		],
	},
	{
		username: "Paul",
		messages: [
			{
				username: "Paul",
				content: "Whats up",
				timeCreated: new Date(),
			},
			{
				username: "Jason",
				content: "Hey",
				timeCreated: new Date(),
			},
		],
	},
	{
		username: "Leory",
		messages: [
			{
				username: "Leory",
				content: "Whats up",
				timeCreated: new Date(),
			},
			{
				username: "Leory",
				content: "Hey",
				timeCreated: new Date(),
			},
		],
	},
];

const MessageBoard = () => {
	const [conversation, setConversation] = useState("");
	const [open, setOpen] = useState(true);
	const theme = useTheme();

	const toggleDrawer = () => setOpen(!open);

	const list = () => (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={toggleDrawer}
			onKeyDown={toggleDrawer}
			justifyItems={"center"}>
			<List>
				<Button
					variant="contained"
					color={"secondary"}
					startIcon={<AddCircleIcon />}
					size="large"
					sx={{ ml: 2.5, my: 1 }}>
					New Conversation
				</Button>
				{conversations.map((c, i) => (
					<React.Fragment key={"Contact__" + c.username + "-" + i}>
						<Box
							bgcolor={
								c.username === conversation ? theme.palette.primary.light : ""
							}
							color={c.username === conversation ? "white" : ""}>
							<ListItem
								disablePadding
								secondaryAction={
									<IconButton edge="end" aria-label="delete">
										<DeleteIcon />
									</IconButton>
								}>
								<ListItemButton onClick={() => setConversation(c.username)}>
									<ListItemIcon>
										<Avatar aria-label="User Icon">
											{c.username.charAt(0)}
										</Avatar>
									</ListItemIcon>
									<ListItemText primary={c.username} />
								</ListItemButton>
							</ListItem>
						</Box>
						{i < conversations.length - 1 && <Divider />}
					</React.Fragment>
				))}
			</List>
		</Box>
	);

	return (
		<>
			<Box position={"sticky"} bgcolor={"background.default"} top={0} left={0}>
				<IconButton onClick={toggleDrawer}>
					<RecentActorsIcon fontSize={"large"} color="primary" />
				</IconButton>
			</Box>
			<Grid padding={2} width={"100%"} height={"100%"} container columns={5}>
				<Grid item xs={0}>
					<Drawer anchor={"left"} open={open} onClose={toggleDrawer}>
						{list()}
					</Drawer>
				</Grid>
				<Grid item xs={5}>
					{(conversation && (
						<Stack minHeight={"78vh"} justifyContent={"end"}>
							<Conversation
								conversations={conversations}
								conversation={conversation}
							/>
							<Messenger />
						</Stack>
					)) || (
						<Typography align={"center"}>No Conversation Selected</Typography>
					)}
				</Grid>
			</Grid>
		</>
	);
};

export default MessageBoard;
