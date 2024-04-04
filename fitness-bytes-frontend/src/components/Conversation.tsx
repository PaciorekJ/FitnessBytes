import { CircularProgress, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useBannerStore from "../hooks/useBannerStore";
import useMessages from "../hooks/useMessages";
import NotificationServices from "../services/NotificationServices";
import Message from "./Message";
import { MessageNotificationProps } from "./MessageNotification";
import PageSpinner from "./PageSpinner";

interface Props {
	conversationId: string; // User of the selected conversation
}

const Conversation = ({ conversationId }: Props) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data, isLoading, fetchNextPage, hasNextPage } =
		useMessages(conversationId);
	const queryClient = useQueryClient();
	const conversationPages = data?.pages || [];

	const banner = useBannerStore((s) => s.banner);
	const setBanner = useBannerStore((s) => s.setBanner);

	useEffect(() => {
		const notification: MessageNotificationProps =
			banner.notification as MessageNotificationProps;
		if (
			typeof banner.notification !== "string" &&
			notification &&
			notification.converstionId &&
			notification.converstionId === conversationId
		) {
			setBanner("");
			NotificationServices.deleteByConversation(conversationId);
		}
	}, [banner, conversationId, setBanner]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [conversationId, data]);

	useEffect(() => {
		const clearConvoNotifications = async () => {
			if (isLoading) return;
			await NotificationServices.deleteByConversation(conversationId);
		};

		clearConvoNotifications();

		queryClient.invalidateQueries({ queryKey: ["NotificationMessageCount"] });
		queryClient.invalidateQueries({ queryKey: ["NotificationCount"] });
	}, [isLoading, conversationId, queryClient]);

	return (
		<>
			{isLoading && (
				<Stack
					sx={{
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "start",
						margin: "auto",
					}}>
					<CircularProgress color="secondary" />
				</Stack>
			)}
			{!isLoading &&
				!conversationPages.reduce((acc, e) => (acc += e?.length || 0), 0) && (
					<Stack
						sx={{
							width: "100%",
							height: "100%",
							alignItems: "center",
							justifyContent: "start",
							margin: "auto",
						}}>
						<Typography variant="body2" color={"text.disabled"} component="h3">
							Go on, send the first message
						</Typography>
						😁
					</Stack>
				)}
			<Stack
				id="scrollableDiv"
				sx={{
					height: 500,
					overflow: "auto",
					flexDirection: "column-reverse",
				}}>
				<InfiniteScroll
					dataLength={conversationPages.reduce(
						(acc1, page) => (acc1 += (page || []).length),
						0,
					)}
					next={fetchNextPage}
					style={{
						display: "flex",
						padding: 5,
						flexDirection: "column-reverse",
					}}
					inverse={true}
					hasMore={hasNextPage}
					loader={<PageSpinner />}
					scrollableTarget="scrollableDiv">
					{conversationPages.map((conversationPage, i) => (
						<React.Fragment
							key={`ConversationPage/${conversationId}/${conversationPage}/${i}`}>
							{conversationPage?.map((m, j) => {
								return (
									<Message
										key={`Conversation__Messages-${i}/${j}/${m.timeCreated}/${m.senderUsername.length}`}
										message={m}
									/>
								);
							})}
						</React.Fragment>
					))}
				</InfiniteScroll>
			</Stack>
			<div ref={messagesEndRef}></div>
		</>
	);
};

export default Conversation;
