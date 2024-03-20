import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { INotification } from "../services/NotificationServices";
import SocketServices from "../services/SocketServices";
import UserServices from "../services/UserServices";

const UserLayout = () => {
	const navigator = useNavigate();
	const client = useQueryClient();

	useEffect(() => {
		const authUser = async () => {
			const username = await UserServices.isAuth();
			if (!username) {
				navigator("/");
				return;
			}

			SocketServices.setUp(username);

			SocketServices.registerCallback("Notification Recieved", (m) => {
				console.log("Reached Callback -> outside");
				client.setQueryData<INotification[]>(["notifications"], (old) => {
					const oldNotifications = old || [];
					console.log("Reached Callback -> inside");
					return [...oldNotifications, m as INotification];
				});
			});
		};

		authUser();
	}, [navigator]);

	return (
		<div>
			<Nav />
			<Outlet />
		</div>
	);
};

export default UserLayout;
