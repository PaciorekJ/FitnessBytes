import { Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

interface AlertContentProps {
    icon: ReactNode;
    content: ReactNode;
}

const AlertContent = ({icon, content}: AlertContentProps) => {
	return (
		<Stack flexDirection={"row"} alignItems={"center"} gap={2}>
			{icon}
			<Typography component={"p"}>{content}</Typography>
		</Stack>
	);
};

export default AlertContent;
