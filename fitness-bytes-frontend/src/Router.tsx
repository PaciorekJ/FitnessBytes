import { Outlet, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Feed from "./pages/Feed";
import Welcome from "./pages/Welcome";
import Error from "./pages/Error";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <Error />,
		element: <Outlet />,
		children: [
			{
				index: true,
				element: <Welcome />,
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
