import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import NotificationServices, {
	INotification,
} from "../services/NotificationServices";

interface Props {
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
	icon,
	content,
	timestamp,
	_id,
	actions = false,
	actionOnAccept = () => {},
	actionOnReject = () => {},
	actionOnDelete = () => {},
}: Props) => {
	const client = useQueryClient();

	const deleteNotification = async (fn: () => void = () => {}) => {
		fn();
		const res = await NotificationServices.delete(_id);

		if (res) {
			client.setQueryData<INotification[]>(["notifications"], (old) => {
				console.log(old);
				console.log(old?.filter((n) => n._id === _id));
				return old?.filter((n) => n._id !== _id) || [];
			});
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
					{actions && (
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
					<Typography
						variant="subtitle2"
						fontSize={"0.7rem"}>{`${timestamp.getMinutes()}m ago`}</Typography>
					<IconButton onClick={() => deleteNotification(actionOnDelete)}>
						<DeleteIcon />
					</IconButton>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Notification;
