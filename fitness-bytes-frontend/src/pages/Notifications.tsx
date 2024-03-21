import {
	Button,
	CircularProgress,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import useNotifications from "../hooks/useNotifications";
import { NotificationFactory } from "../services/NotificationFactory";
import NotificationServices from "../services/NotificationServices";

const fact = new NotificationFactory();

const Notifications = () => {
	const { data, isLoading } = useNotifications();
	const queryClient = useQueryClient();
	const notifications = data || [];

	const clearNotifications = async () => {
		await NotificationServices.deleteAll();
		queryClient.setQueryData(["notifications"], () => []);
		queryClient.setQueryData(["NotificationMessageCount"], () => 0);
		queryClient.setQueryData(["NotificationCount"], () => 0);
	};

	return (
		<>
			<Stack
				sx={{
					justifyContent: "center",
					padding: 2,
				}}
				flexDirection={"row"}
				alignItems={"center"}>
				<Typography variant="h3" color={"secondary"} component={"h2"}>
					Notifications
				</Typography>
				<Stack
					sx={{
						alignItems: "end",
					}}
					width={"100%"}
					alignItems={"end"}
					justifyContent={"center"}>
					<Button
						color="secondary"
						variant="outlined"
						onClick={clearNotifications}>
						Clear Notifications
					</Button>
				</Stack>
			</Stack>
			<Divider
				sx={{ marginBottom: 3, marginTop: 1 }}
				variant="middle"></Divider>
			{isLoading && (
				<Stack padding={15} alignItems={"center"} width={"100vw"}>
					<CircularProgress size={"5%"} color="secondary" />
				</Stack>
			)}
			{!notifications.length && !isLoading && (
				<Stack padding={15} alignItems={"center"} width={"100vw"}>
					<Typography color={"text.disabled"}> No Notifications</Typography>
				</Stack>
			)}
			<Stack gap={2}>
				{notifications.map((n) => (
					<React.Fragment key={n._id}>{fact.create(n)}</React.Fragment>
				))}
			</Stack>
		</>
	);
};

export default Notifications;
