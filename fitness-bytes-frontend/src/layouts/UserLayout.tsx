import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import UserServices from "../services/UserServices";
import SocketServices from "../services/SocketServices";

const UserLayout = () => {
	const navigator = useNavigate();

	useEffect(() => {
		const authUser = async () => {
			const username = await UserServices.isAuth();
			if (!username) {
				navigator("/");
				return
			}

			SocketServices.setUp(username);

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
