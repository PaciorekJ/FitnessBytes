import { createBrowserRouter } from "react-router-dom";
import Account from "./pages/Account";
import Error from "./pages/Error";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import GuestLayout from "./layouts/GuestLayout";
import UserLayout from "./layouts/UserLayout";

const router = createBrowserRouter([
	{
		path: "",
		errorElement: <Error />,
		children: [
			{
				path: "/",
				element: <GuestLayout />,
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
					}
				],
			},
			{
				path: "/auth/",
				element: <UserLayout />,
				children: [
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
		],
	},
]);

export default router;
