import { CircularProgress, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import useNotifications from "../hooks/useNotifications";
import { NotificationFactory } from "../services/NotificationFactory";
import { INotification } from "../services/NotificationServices";
import SocketServices from "../services/SocketServices";

const fact = new NotificationFactory();

const Notifications = () => {
	const { data, isLoading } = useNotifications();
	const client = useQueryClient();
	const notifications = data || [];

	SocketServices.registerCallback(
		"Notification Recieved",
		(m) => {
			client.setQueryData<INotification[]>(["notifications"], (old) => {
				const oldNotifications = old || [];
				return [...oldNotifications, m as INotification];
			});
		},
	);

	return (
		<>
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
			{notifications.map((n) => (
				<React.Fragment key={n._id}>{fact.create(n)}</React.Fragment>
			))}
		</>
	);
};

export default Notifications;
