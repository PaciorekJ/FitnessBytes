import { Alert, SxProps, Theme } from "@mui/material";
import useBannerStore from "../hooks/useBannerStore";
import { AlertNotificationFactory } from "../services/AlertNotificationFactory";

const NotificationBanner = () => {
	const { isOpen, setOpen, notification } = useBannerStore();

	const styles: SxProps<Theme> = {
		position: "absolute",
		top: "0",
		width: "96%",
		zIndex: "1001",
		overflow: "hidden",
		transition: "opacity .2s ease",
		display: "none",
		flexDirection: "row",
		alignItems: "center",
		margin: "2%",
		boxSizing: "border-box",
		opacity: "0",
	};

	const openStyles: SxProps<Theme> = {
		display: "flex",
		opacity: "1",
	};

	const style = isOpen ? { ...styles, ...openStyles } : styles;

	const fact = new AlertNotificationFactory();

	if (!notification) return null;

	return (
		<Alert color="info" onClose={() => setOpen(false)} sx={style}>
			{fact.create(notification)}
		</Alert>
	);
};

export default NotificationBanner;
