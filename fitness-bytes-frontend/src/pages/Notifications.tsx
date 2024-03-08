import { CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";
import useNotifications from "../hooks/useNotifications";
import { NotificationFactory } from "../services/NotificationFactory";

const fact = new NotificationFactory();

const Notifications = () => {
	const { data, isLoading } = useNotifications();
	const notifications = data || [];
	if (isLoading) {
		return (
			<Stack padding={15} alignItems={"center"} width={"100vw"}>
				<CircularProgress color="inherit" />
			</Stack>
		);
	} else if (!notifications.length) {
		return (
			<Stack padding={15} alignItems={"center"} width={"100vw"}>
				<Typography> No Notifications</Typography>
			</Stack>
		);
	}
	return notifications.map((n) => (
		<React.Fragment key={n._id}>{fact.create(n)}</React.Fragment>
	));
};

export default Notifications;
