import styles from "./index.module.css";

interface Props {
	center?: boolean;
	centerScreen?: boolean;
}

const LogoIcon = ({ center = false, centerScreen = false }: Props) => {
	return (
		<a href="/">
			<img
				className={
					styles.icon +
					" " +
					(center ? styles.center : "") +
					" " +
					(centerScreen ? styles.centerScreen : "") +
					" " +
					styles.xl
				}
				src="src\assets\FitnessBytes-Square.webp"
				alt="Fitness Bytes Logo"
			/>
		</a>
	);
};

export default LogoIcon;
