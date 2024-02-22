import { Avatar, Grid, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { useState } from "react";
import { User } from "../pages/MessageBoard";
import Conversation from "./Conversation";
import Messenger from "./Messenger";

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

export default function Test() {
	const [conversation, setConversation] = useState("");
	const [open, setOpen] = useState(false);
	const theme = useTheme();

	const toggleDrawer = () => setOpen(!open);

	const list = () => (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={toggleDrawer}
			onKeyDown={toggleDrawer}>
			<List>
				{conversations.map((c, i) => (
					<React.Fragment key={"Contact__" + c.username + "-" + i}>
						<Box
							bgcolor={
								c.username === conversation ? theme.palette.primary.light : ""
							}
							color={c.username === conversation ? "white" : ""}>
							<ListItem disablePadding>
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
			<Box position={"sticky"} top={0} left={0}>
				<Button onClick={toggleDrawer}>Open Me</Button>
			</Box>
			<Grid width={"100%"} height={"100%"} container columns={5}>
				<Grid item xs={1}>
					<Drawer anchor={"left"} open={open} onClose={toggleDrawer}>
						{list()}
					</Drawer>
				</Grid>
				<Grid item xs={4}>
					{(conversation && (
						<>
							<Conversation
								conversations={conversations}
								conversation={conversation}
							/>
							<Messenger />
						</>
					)) || <Typography>No Conversation Selected</Typography>}
				</Grid>
			</Grid>
		</>
	);
}
