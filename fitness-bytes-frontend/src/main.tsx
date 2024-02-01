import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Login from "./pages/Login/Login";

import { ThemeProvider, createTheme } from "@mui/material/styles";

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
			<Login />
		</ThemeProvider>
	</React.StrictMode>,
);
