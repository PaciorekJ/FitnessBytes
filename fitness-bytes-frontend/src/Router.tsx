import { Outlet, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Feed from "./pages/Feed";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <p>Oh no</p>,
		element: <Outlet />,
		children: [
			{
				index: true,
				element: <p>Home</p>,
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "signup",
				element: <Signup />,
			},
			{
				path: "account/:username",
				element: <Account />,
			},
			{
				path: "feed/:username",
				element: <Feed />,
			},
		],
	},
]);

export default router;
