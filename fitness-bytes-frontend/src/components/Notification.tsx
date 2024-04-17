import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import useBannerStore from "../hooks/useBannerStore";
import NotificationServices, {
	INotification,
	NotificationTypes,
} from "../services/NotificationServices";
import ParseDateFromNow from "../utils/ParseDate";

interface Props {
	type: NotificationTypes;
	icon: ReactNode;
	content: ReactNode;
	timestamp: Date;
	_id: string;
	actions?: boolean;
	actionOnAccept?: () => void;
	actionOnReject?: () => void;
	actionOnDelete?: () => void;
}

const Notification = ({
	type,
	icon,
	content,
	timestamp,
	_id,
	actions = false,
	actionOnAccept,
	actionOnReject,
	actionOnDelete = () => {},
}: Props) => {
	const [processingDelete, setProcessingDelete] = useState(false);
	const setBanner = useBannerStore((s) => s.setBanner);
	const client = useQueryClient();

	const deleteNotification = async (fn: () => void = () => {}) => {
		setProcessingDelete(true);

		try {
			if (processingDelete) return;
			fn();
			await NotificationServices.delete(_id);
		} catch {
			setBanner("Failed to Delete Notification, Please Try Again!");
			return;
		}

		client.setQueryData<
			InfiniteData<INotification[] | undefined, unknown> | undefined
		>(["notifications"], (oldPages) => {
			if (!oldPages) {
				return {
					pageParams: [],
					pages: [],
				};
			}

			const updatedPages = oldPages.pages.map(
				(page) => page?.filter((n) => n._id !== _id) ?? [],
			);

			return {
				...oldPages,
				pages: updatedPages,
			};
		});

		client.setQueryData<number>(["NotificationCount"], (old) => {
			return old ? old - 1 : 0;
		});

		if (type === NotificationTypes.MessageReceived) {
			client.setQueryData<number>(["NotificationMessageCount"], (old) => {
				return old ? old - 1 : 0;
			});
		}
		setProcessingDelete(false);
	};

	return (
		<Stack
			sx={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
				marginX: 3,
			}}>
			<Stack
				sx={{
					flexDirection: "row",
					alignItems: "center",
					width: "100%",
					gap: 4,
				}}>
				<Box sx={{ alignSelf: "start" }}>

				{icon}
				</Box>
				{content}
			</Stack>
			<Stack
				sx={{
					gap: 2,
					flexDirection: "row",
					alignItems: "center",
				}}
				gap={2}
				flexDirection={"row"}>
				<Stack sx={{ display: "inline" }}>
					{actions && actionOnReject && actionOnAccept && (
						<>
							<IconButton
								color="success"
								onClick={() => deleteNotification(actionOnAccept)}>
								<CheckCircleOutlineOutlinedIcon />
							</IconButton>
							<IconButton
								color="error"
								onClick={() => deleteNotification(actionOnReject)}>
								<CancelOutlinedIcon />
							</IconButton>
						</>
					)}
				</Stack>
				<Stack>
					<Typography
						sx={{ textWrap: "nowrap" }}
						variant="subtitle2"
						fontSize={"0.5rem"}>
						{ParseDateFromNow(timestamp)}
					</Typography>
					{!processingDelete ? (
						<IconButton onClick={() => deleteNotification(actionOnDelete)}>
							<DeleteIcon />
						</IconButton>
					) : (
						<Stack
							padding={1.5}
							justifyContent={"center"}
							alignItems={"center"}>
							<CircularProgress size={"1rem"} />
						</Stack>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Notification;
