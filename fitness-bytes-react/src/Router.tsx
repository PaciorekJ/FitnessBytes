import { createBrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import React from "react";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
]);

export default router;
