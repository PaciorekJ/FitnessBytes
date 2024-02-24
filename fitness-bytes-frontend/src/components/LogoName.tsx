import { Box, Typography, useTheme } from "@mui/material";

interface Props {
	center?: boolean;
}

const LogoName = ({ center = false }: Props) => {
	const theme = useTheme();

	const fontSizes = {
		xs: "2rem",
		sm: "3rem",
		md: "4rem",
	};

	const generalStyles = {
		fontSize: { ...fontSizes },
		display: "inline",
	};

	return (
		<Box textAlign={center ? "center" : "initial"}>
			<Typography
				sx={{
					...generalStyles,
					color: theme.palette.primary.main,
				}}
				variant="h2">
				Fitness
			</Typography>
			<Typography
				sx={{
					...generalStyles,
					color: theme.palette.secondary.main,
				}}
				variant="h2">
				Bytes
			</Typography>
		</Box>
	);
};

export default LogoName;
