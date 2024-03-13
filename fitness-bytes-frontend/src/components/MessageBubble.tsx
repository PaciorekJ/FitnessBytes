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
		bgcolor: theme.palette.secondary.light,
	};

	const MessageLeftStyles = {
		borderRadius: "25px 25px 25px 0",
		bgcolor: theme.palette.primary.main,
	};

	return (
		<Box
			sx={{
				padding: "1rem",
				maxWidth: "75%",
				color: theme.palette.primary.contrastText,
				...(isCurrentUsers ? MessageRightStyles : MessageLeftStyles),
			}}>
			{children}
		</Box>
	);
};

export default MessageBubble;
