import { CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";
import useNotifications from "../hooks/useNotifications";
import { NotificationFactory } from "../services/NotificationFactory";

const fact = new NotificationFactory();

const Notifications = () => {
	const { data, isLoading } = useNotifications();
	const notifications = data || [];

	return (
		<>
			{isLoading && (
				<Stack padding={15} alignItems={"center"} width={"100vw"}>
					<CircularProgress size={"5%"} color="secondary" />
				</Stack>
			)}
			{!notifications.length && !isLoading && (
				<Stack padding={15} alignItems={"center"} width={"100vw"}>
					<Typography> No Notifications</Typography>
				</Stack>
			)}
			{notifications.map((n) => (
				<React.Fragment key={n._id}>{fact.create(n)}</React.Fragment>
			))}
		</>
	);
};

export default Notifications;
