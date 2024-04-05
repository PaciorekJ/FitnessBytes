import { Button, Divider, Stack, Typography } from "@mui/material";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PageSpinner from "../components/PageSpinner";
import useNotifications from "../hooks/useNotifications";
import { NotificationFactory } from "../services/NotificationFactory";
import NotificationServices, {
	INotification,
} from "../services/NotificationServices";

const fact = new NotificationFactory();

const Notifications = () => {
	const { data, fetchNextPage, hasNextPage } = useNotifications();
	const queryClient = useQueryClient();

	const notificationPages = data?.pages || [];

	const clearNotifications = async () => {
		await NotificationServices.deleteAll();
		queryClient.setQueryData<
			InfiniteData<INotification[] | undefined, unknown> | undefined
		>(["notifications"], () => ({
			pageParams: [],
			pages: [],
		}));

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
				<Stack width={"100%"} alignItems={"end"}>
					<Button
						color="secondary"
						variant="outlined"
						sx={{ fontSize: { xs: ".7rem", sm: ".9rem", md: "1rem" } }}
						onClick={clearNotifications}>
						Clear Notifications
					</Button>
				</Stack>
			</Stack>
			<Divider
				sx={{ marginBottom: 3, marginTop: 1 }}
				variant="middle"></Divider>
			{(notificationPages?.length && notificationPages[0]?.length && (
				<InfiniteScroll
					hasMore={hasNextPage}
					loader={<PageSpinner />}
					next={fetchNextPage}
					dataLength={notificationPages?.length || 0}>
					{notificationPages.map((notifications) => (
						<Stack gap={2}>
							{notifications?.map((n, i) => {
								return (
									<React.Fragment
										key={`${n._id} + ${n.dispatcherId.charAt(i) || i}) ${
											n.dispatcherId
										} - ${n.recipientId}`}>
										{fact.create(n)}
									</React.Fragment>
								);
							})}
						</Stack>
					))}
				</InfiniteScroll>
			)) || (
				<Stack padding={15} alignItems={"center"} width={"100vw"}>
					<Typography color={"text.disabled"}> No Notifications</Typography>
				</Stack>
			)}
		</>
	);
};

export default Notifications;
