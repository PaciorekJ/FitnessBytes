import { CircularProgress, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import useBannerStore from "../hooks/useBannerStore";
import useMessages from "../hooks/useMessages";
import { IMessage } from "../services/MessageServices";
import NotificationServices from "../services/NotificationServices";
import Message from "./Message";
import { MessageNotificationProps } from "./MessageNotification";

interface Props {
	conversationId: string; // User of the selected conversation
	
}

const Conversation = ({ conversationId }: Props) => {
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data, isLoading } = useMessages(conversationId);
	const queryClient = useQueryClient();
	const conversation: IMessage[] = data || [];

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
			{!isLoading && !conversation.length && (
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
			<Stack gap={2}>
				{conversation.map((m, i) => {
					return <Message key={"Conversation__Messages-" + i} message={m} />;
				})}
			</Stack>
			<div ref={messagesEndRef}></div>
		</>
	);
};

export default Conversation;
