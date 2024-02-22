import { createBrowserRouter } from "react-router-dom";
import Account from "./pages/Account";
import Error from "./pages/Error";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import GuestLayout from "./layouts/GuestLayout";
import UserLayout from "./layouts/UserLayout";
import Post from "./pages/Post";
import MessageBoard from "./pages/MessageBoard";
import Test from "./components/Test";
import Theme from "./layouts/Theme";

const router = createBrowserRouter([
	{
		path: "",
		errorElement: <Error />,
		element: <Theme />,
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
					},
					{
						path: "test",
						element: <Test />,
					},
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
					{
						path: "post/:postId",
						element: <Post />,
					},
					{
						path: "messages/:username",
						element: <MessageBoard />,
					},
				],
			},
		],
	},
]);

export default router;
