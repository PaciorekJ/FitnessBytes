import {
	Notification,
	NotificationFactory,
	NotificationPayload,
} from "../interfaces/Notifcations";

const notifications: (Notification & NotificationPayload)[] = [
	{
		type: "Friend Request",
		fromUsername: "Jason",
		fromUserId: "123",
		timestamp: new Date(),
	},
  {
		type: "Friend Request",
		fromUsername: "Jason",
		fromUserId: "123",
		timestamp: new Date(),
	},
  {
		type: "Friend Request",
		fromUsername: "Jason",
		fromUserId: "123",
		timestamp: new Date(),
	},
];

const fact = new NotificationFactory();

const Notifications = () => {
	return notifications.map((n) => fact.create(n)?.render(`${n.type}__${n.fromUserId}__${n.timestamp}`));
};

export default Notifications;
