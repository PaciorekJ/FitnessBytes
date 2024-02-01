import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";


import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import router from "./Router";

const theme = createTheme({
	palette: {
		primary: {
			main: "#2e250b",
		},
		secondary: {
			main: "#647c42",
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<RouterProvider router={router}/>
		</ThemeProvider>
	</React.StrictMode>,
);
