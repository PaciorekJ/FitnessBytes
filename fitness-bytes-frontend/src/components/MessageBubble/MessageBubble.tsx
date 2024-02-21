import React, { ReactNode } from "react";
import styles from "./index.module.css";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

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
			className={
				styles.Message +
				" " +
				(isCurrentUsers ? styles["Message-Right"] : styles["Message-Left"])
			}>
			<Typography variant={"body1"}>{children}</Typography>
		</Box>
	);
};

export default MessageBubble;
