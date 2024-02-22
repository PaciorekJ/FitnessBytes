import styles from "./index.module.css";

import logo from "./../../assets/Favi-FitnessBytes-v2-no-background.webp";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material";

interface Props {
	center?: boolean;
	centerScreen?: boolean;
	sizes?: string;
	href?: string;
}

const LogoIcon = ({
	center = false,
	centerScreen = false,
	sizes = "2em",
}: Props) => {
	const theme = useTheme();

	return (
		<Box
			component="img"
			width={sizes}
			height={sizes}
			className={
				styles.icon +
				" " +
				(center ? styles.center : "") +
				" " +
				(centerScreen ? styles.centerScreen : "")
			}
			bgcolor={theme.palette.primary.contrastText}
			borderRadius={"100%"}
			src={logo}
			alt="Fitness Bytes Logo"
		/>
	);
};

export default LogoIcon;
