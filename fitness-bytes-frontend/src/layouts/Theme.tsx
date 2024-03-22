import {
	CssBaseline,
	GlobalStyles,
	ThemeProvider,
	createTheme,
} from "@mui/material";
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import getTheme from "../Theme";
import useThemeStore from "../hooks/useThemeStore";

interface Props {
	children: ReactNode;
}

const Theme = ({ children }: Props) => {
	const { mode } = useThemeStore();

	const theme = createTheme(getTheme(mode));

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<GlobalStyles
				styles={(theme) => ({
					body: {
						backgroundColor: theme.palette.background.default,
						color: theme.palette.text.primary,
					},
				})}
			/>
			<Outlet />
			{children}
		</ThemeProvider>
	);
};

export default Theme;
