import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

const UserLayout = () => {
	return (
		<div>
			<Nav />
			<Outlet />
		</div>
	);
};

export default UserLayout;
