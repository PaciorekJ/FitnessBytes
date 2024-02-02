import { Box, Typography, useTheme } from "@mui/material";

const Logo = () => {
	const theme = useTheme();
	return (
		<Box maxWidth={"100vw"} textAlign={"center"}>
			<Typography
				variant="h2"
				color={theme.palette.primary.main}
				display={"inline"}>
				Fitness
			</Typography>
			<Typography
				variant="h2"
				color={theme.palette.secondary.main}
				display={"inline"}>
				Bytes
			</Typography>
		</Box>
	);
};

export default Logo;
