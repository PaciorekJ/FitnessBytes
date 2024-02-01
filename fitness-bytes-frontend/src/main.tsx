import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import Login from "./pages/Login/Login";

import { ThemeProvider, createTheme } from "@mui/material/styles";

// --color-primary: rgba(158, 138, 95, .5);
// 	--color-primary-2: rgba(192, 185, 160, 1);
// 	--color-accent: #647c42;
// 	--color-neutral: #2e250b;

//     --color-accent-warm: rgba(171, 176, 142, 1);
//     --color-accent-warm-lighter: rgba(192, 185, 160, 1);

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
