import { CircularProgress, Typography } from "@mui/material";
import useNotifications from "../hooks/useNotifications";
import { NotificationFactory } from "../interfaces/Notifcations";

const fact = new NotificationFactory();

const Notifications = () => {
	const { data, isLoading } = useNotifications();
	const notifications = data?.result || [];
	console.log(notifications);
	if (isLoading) {
		return <CircularProgress color="inherit" />;
	} else if (!notifications.length) {
		return <Typography> No Notifications</Typography>;
	}
	return notifications?.map((n) => fact.create(n)?.render());
};

export default Notifications;
