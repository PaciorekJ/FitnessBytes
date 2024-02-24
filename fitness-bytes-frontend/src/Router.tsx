import { createBrowserRouter } from "react-router-dom";
import Test from "./components/Test";
import GuestLayout from "./layouts/GuestLayout";
import Theme from "./layouts/Theme";
import UserLayout from "./layouts/UserLayout";
import Account from "./pages/Account";
import Error from "./pages/Error";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import MessageBoard from "./pages/MessageBoard";
import Post from "./pages/Post";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";

const router = createBrowserRouter([
	{
		path: "",
		element: <Theme />,
		errorElement: (
			<Theme>
				<Error />
			</Theme>
		),
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
