import { Box, useTheme } from "@mui/material";
import { ReactNode } from "react";
import styles from "./index.module.css";

interface Props {
	isCurrentUsers: boolean;
	children: ReactNode;
}

const MessageBubble = ({ isCurrentUsers, children }: Props) => {
	const theme = useTheme();
	return (
		<Box
			bgcolor={
				isCurrentUsers
					? theme.palette.secondary.light
					: theme.palette.primary.main
			}
			color={theme.palette.primary.contrastText}
			className={
				styles.Message +
				" " +
				(isCurrentUsers ? styles["Message-Right"] : styles["Message-Left"])
			}>
			{children}
		</Box>
	);
};

export default MessageBubble;
