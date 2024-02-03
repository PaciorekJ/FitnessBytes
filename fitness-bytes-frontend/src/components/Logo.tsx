import { Box, Typography, useTheme } from "@mui/material";

interface Props {
	center?: boolean;
}

const Logo = ({ center = false }: Props) => {
	const theme = useTheme();
	return (
		<Box textAlign={center ? "center" : "initial"}>
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
