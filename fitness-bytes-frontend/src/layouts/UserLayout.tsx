import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import UserServices from "../services/UserServices";

const UserLayout = () => {
	const navigator = useNavigate();

	useEffect(() => {
		const authUser = async () => {
			const client = new UserServices();
			try {
				await client.isAuth();
			} catch {
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
