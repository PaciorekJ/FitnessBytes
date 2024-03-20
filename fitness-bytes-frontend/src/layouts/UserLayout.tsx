import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
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

			SocketServices.setUp(username, client);
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
