import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import NotificationServices, {
	INotification, NotificationTypes,
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
	const client = useQueryClient();

	const deleteNotification = async (fn: () => void = () => {}) => {
		fn();
		const res = await NotificationServices.delete(_id);

		if (res) {
			client.setQueryData<INotification[]>(["notifications"], (old) => {
				return old?.filter((n) => n._id !== _id) || [];
			});
			client.setQueryData<number>(["NotificationCount"], (old) => {
				return old ? old - 1: 0;
			});
			if (type === NotificationTypes.MessageReceived) {
				client.setQueryData<number>(["NotificationMessageCount"], (old) => {
					return old ? old - 1: 0;
				});
			}
		}
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
					gap: 4,
				}}>
				{icon}
				<Typography>{content}</Typography>
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
				<Stack maxWidth={"50px"}>
					<Typography variant="subtitle2" fontSize={"0.5rem"}>
						{ParseDateFromNow(timestamp)}
					</Typography>
					<IconButton onClick={() => deleteNotification(actionOnDelete)}>
						<DeleteIcon />
					</IconButton>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Notification;
