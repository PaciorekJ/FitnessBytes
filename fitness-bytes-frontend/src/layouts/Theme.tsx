import {
	CssBaseline,
	GlobalStyles,
	ThemeProvider,
	createTheme,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import getTheme from "../Theme";
import useThemeStore from "../hooks/useThemeStore";
import { ReactNode } from "react";

interface Props {
	children: ReactNode;
}

const Theme = ({ children }: Props) => {
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
			{children}
		</ThemeProvider>
	);
};

export default Theme;
