import {
	CssBaseline,
	GlobalStyles,
	ThemeProvider,
	createTheme,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import getTheme from "../Theme";
import useThemeStore from "../hooks/useThemeStore";

const Theme = () => {
	const { mode } = useThemeStore();

	const theme = createTheme(getTheme(mode));

	return (
		<ThemeProvider theme={theme}>
			<GlobalStyles
				styles={(theme) => ({
					body: {
						backgroundColor: theme.palette.background.default,
						color: theme.palette.text.primary,
					},
				})}
			/>
			<CssBaseline />
			<Outlet />
		</ThemeProvider>
	);
};

export default Theme;
