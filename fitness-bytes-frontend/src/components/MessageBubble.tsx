import { Box, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface Props {
	isCurrentUsers: boolean;
	children: ReactNode;
}

const MessageBubble = ({ isCurrentUsers, children }: Props) => {
	const theme = useTheme();

	const MessageRightStyles = {
		borderRadius: "25px 25px 0 25px",
	};

	const MessageLeftStyles = {
		borderRadius: "25px 25px 25px 0",
	};

	return (
		<Box
			sx={{
				padding: "1rem",
				width: "75%",
				color: theme.palette.primary.contrastText,
				bgcolor: isCurrentUsers
					? theme.palette.secondary.light
					: theme.palette.primary.main,
				...(isCurrentUsers ? MessageRightStyles : MessageLeftStyles),
			}}>
			{children}
		</Box>
	);
};

export default MessageBubble;
