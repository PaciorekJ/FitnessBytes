import { Box, SxProps, Typography, useTheme } from "@mui/material";

interface Props {
	center?: boolean;
	sx?: SxProps;
}

const LogoName = ({ center = false, sx }: Props) => {
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
		<Box display={"block"} textAlign={center ? "center" : "initial"} sx={sx}>
			<Typography
				sx={{
					...generalStyles,
					"color": theme.palette.primary.main,
					"text-shadow": `1px 1px 2px ${theme.palette.secondary.main}, 0px -1px 1px ${theme.palette.secondary.main}, 0 0 0em ${theme.palette.secondary.main}`,
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
