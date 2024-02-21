import {
	Avatar,
	Box,
	CardHeader,
	Divider,
	Grid,
	Stack,
	useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Conversation from "../components/Conversation";

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
	const theme = useTheme();

	return (
		<Stack
			paddingRight={1}
			gap={2}
			width={"100vw"}
			justifyContent={"space-between"}
			flexDirection={"row"}>
			<Stack minWidth={"200px"}>
				{conversations.map((c, i) => (
					<React.Fragment key={c.username + "conversations" + i}>
						<Box
							bgcolor={
								c.username === conversation ? theme.palette.primary.light : ""
							}
							color={c.username === conversation ? "white" : ""}>
							<CardHeader
								onClick={() => setConversation(c.username)}
								title={c.username}
								avatar={
									<Avatar aria-label="User Icon">{c.username.charAt(0)}</Avatar>
								}
							/>
						</Box>
						{i < conversations.length - 1 && <Divider />}
					</React.Fragment>
				))}
			</Stack>
			<Stack width={"100%"}>
				<Conversation
					conversations={conversations}
					conversation={conversation}
				/>
                Messager
			</Stack>
		</Stack>
	);
};

export default MessageBoard;
