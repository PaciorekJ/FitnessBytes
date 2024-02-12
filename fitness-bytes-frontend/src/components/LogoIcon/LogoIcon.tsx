import styles from "./index.module.css";

import logo from "../../assets/FitnessBytes-Square.webp";
import Box from "@mui/material/Box";

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
			src={logo}
			alt="Fitness Bytes Logo"
		/>
	);
};

export default LogoIcon;
