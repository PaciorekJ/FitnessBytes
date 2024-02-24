import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import logo from "../assets/Favi-FitnessBytes-v2-no-background.webp";

interface Props {
	center?: boolean;
	size: string;
}

const LogoIcon = ({ center = false, size }: Props) => {
	const theme = useTheme();

	const centerStyles = center && {
		position: "absolute",
		top: "0%",
		left: "50%",
		zIndex: "10000",
		padding: "1rem",
		transform: "translateX(-50%)",
	};

	return (
		<Box
			component="img"
			width={size}
			sx={{
				aspectRatio: "1",
				width: size,
				caretColor: "transparent",
				...centerStyles,
				bgcolor: theme.palette.primary.contrastText,
				borderRadius: "100vw",
			}}
			src={logo}
			alt="Fitness Bytes Logo"
		/>
	);
};

export default LogoIcon;
