import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import logo from "../assets/Favi-FitnessBytes-v2-no-background.webp";

interface Props {
	size: string;
}

const LogoIcon = ({ size }: Props) => {
	const theme = useTheme();

	return (
		<Box
			component="img"
			width={size}
			sx={{
				aspectRatio: "1",
				width: size,
				caretColor: "transparent",
				bgcolor: theme.palette.primary.contrastText,
				borderRadius: "100vw",
			}}
			src={logo}
			alt="Fitness Bytes Logo"
		/>
	);
};

export default LogoIcon;
