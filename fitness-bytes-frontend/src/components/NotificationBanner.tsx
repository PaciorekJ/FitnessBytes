import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Alert, SxProps, Theme } from "@mui/material";
import useBannerStore from "../hooks/useBannerStore";
import useThemeStore from "../hooks/useThemeStore";
import { AlertNotificationFactory } from "../services/AlertNotificationFactory";

const NotificationBanner = () => {
	const { isOpen, setOpen, banner } = useBannerStore();
	const mode = useThemeStore((s) => s.mode);

	const styles: SxProps<Theme> = {
		position: "absolute",
		top: 0,
		width: "100%",
		zIndex: "1001",
		overflow: "hidden",
		backgroundColor:
			mode === "dark" ? `rgba(255, 255, 255, 0.3)` : `rgba(0, 0, 0, 0.3)`, // Semi-transparent background
		backdropFilter: "blur(20px)", // Apply blur effect only to the background
		WebkitBackdropFilter: "blur(20px)", // For Safari compatibility
		transition: "opacity .5s ease, max-height .2s ease",
		display: "none",
		border: "1px solid",
		color: "primary.main",
		maxHeight: "0",
		flexDirection: "row",
		alignItems: "center",
		boxSizing: "border-box",
		opacity: 0,
	};

	const openStyles: SxProps<Theme> = {
		display: "flex",
		maxHeight: "auto",
		opacity: "1",
	};

	const style = isOpen ? { ...styles, ...openStyles } : styles;

	const fact = new AlertNotificationFactory();

	if (!banner.notification) return null;

	return (
		<>
			<Alert
				icon={banner.error ? <ErrorOutlineIcon /> : false}
				onClose={() => setOpen(false)}
				sx={style}>
				{fact.create(banner.notification)}
			</Alert>
		</>
	);
};

export default NotificationBanner;
