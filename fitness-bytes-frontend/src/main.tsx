import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import router from "./Router";

const colors = {
	darkBlue: "#010110",
	lightGreenishWhite: "#f1fbef",
	vibrantOrange: "#f47227",
	teal: "#11b4bd",
	navyBlue: "#163a63",
};

// Create a theme instance
const theme = createTheme({
	palette: {
		primary: {
			main: colors.navyBlue, // Used for primary buttons and links
			contrastText: colors.lightGreenishWhite, // Text color for primary buttons
		},
		secondary: {
			main: colors.teal, // Used for secondary buttons and accents
			contrastText: colors.darkBlue, // Text color for secondary buttons
		},
		error: {
			main: colors.vibrantOrange, // Used for error states and icons
		},
		background: {
			default: colors.lightGreenishWhite, // Replace with the hex color code for the page background
			paper: colors.lightGreenishWhite, // Replace with the hex color code for the background of paper elements
		},
		text: {
			primary: colors.darkBlue, // Primary text color
			secondary: colors.navyBlue,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				// Target the size "large"
				sizeLarge: {
					padding: "1em", // Increase padding
				},
			},
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	</React.StrictMode>,
);
