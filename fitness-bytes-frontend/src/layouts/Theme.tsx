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
					"&::-webkit-scrollbar": {
						marginBlock: "1em",
						borderRadius: "100vw",
						backgroundColor: theme.palette.background.paper,
						width: "1em",
					},
					"&::-webkit-scrollbar-thumb": {
						backgroundImage:
							mode === "dark"
								? `linear-gradient(to left,  ${theme.palette.primary.contrastText}, ${theme.palette.secondary.main})`
								: `linear-gradient(to left, ${theme.palette.secondary.contrastText}, ${theme.palette.primary.main})`,
						borderRadius: "100vw",
						borderColor: "black",
					},
					"body": {
						backgroundColor: theme.palette.background.default,
						color: theme.palette.text.primary,
						maxWidth: "100vw",
						overflowX: "hidden",
					},
				})}
			/>
			<Outlet />
			{children}
		</ThemeProvider>
	);
};

export default Theme;
