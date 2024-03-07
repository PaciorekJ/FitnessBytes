import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import UserServices from "../services/UserServices";

const UserLayout = () => {
	const navigator = useNavigate();

	useEffect(() => {
		const authUser = async () => {
			const res = await UserServices.isAuth();
			if (!res) {
				navigator("/");
			}
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
