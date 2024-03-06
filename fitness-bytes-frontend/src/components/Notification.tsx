import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
	icon: ReactNode;
	content: ReactNode;
	timestamp: Date;
	actions?: boolean;
	actionOnAccept?: () => void;
	actionOnReject?: () => void;
}

const Notification = ({
	icon,
	content,
	timestamp,
	actions = false,
	actionOnAccept = () => {},
	actionOnReject = () => {},
}: Props) => {
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
			<Stack gap={2} flexDirection={"row"}>
				<Stack
					sx={{
						flexDirection: "row",
						display: "inline",
						marginLeft: 3,
					}}>
					{actions && (
						<>
							<IconButton color="success" onClick={actionOnAccept}>
								<CheckCircleOutlineOutlinedIcon />
							</IconButton>
							<IconButton color="error" onClick={actionOnReject}>
								<CancelOutlinedIcon />
							</IconButton>
						</>
					)}
				</Stack>
				<Stack maxWidth={"50px"}>
					<Typography
						variant="subtitle2"
						fontSize={"0.7rem"}>{`${timestamp.getMinutes()}m ago`}</Typography>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Notification;
