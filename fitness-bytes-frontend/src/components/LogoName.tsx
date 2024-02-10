import { Box, Typography, useTheme } from "@mui/material";

interface Props {
	center?: boolean;
}

const fontSizes = {
	xs: "2rem",
	sm: "3rem",
	md: "4rem",
};

const LogoName = ({ center = false }: Props) => {
	const theme = useTheme();
	return (
		<Box textAlign={center ? "center" : "initial"}>
			<Typography
				fontSize={{ ...fontSizes }}
				variant="h2"
				color={theme.palette.primary.main}
				display={"inline"}>
				Fitness
			</Typography>
			<Typography
				fontSize={{ ...fontSizes }}
				variant="h2"
				color={theme.palette.secondary.main}
				display={"inline"}>
				Bytes
			</Typography>
		</Box>
	);
};

export default LogoName;
