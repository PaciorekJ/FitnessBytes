import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "./layouts/GuestLayout";
import Account from "./pages/Account";
import Error from "./pages/Error";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";

const router = createBrowserRouter([
	{
		path: "/",
		errorElement: <Error />,
		element: <GuestLayout/>,
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
