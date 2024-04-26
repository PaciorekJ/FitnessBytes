import {
	Button,
	IconButton,
	Link,
	List,
	ListItem,
	Stack,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LogoIcon from "../components/LogoIcon";
import useThemeStore from "../hooks/useThemeStore";
import UserServices from "../services/UserServices";

const GuestLayout = () => {
	const navigator = useNavigate();
	const toggleTheme = useThemeStore((s) => s.toggleTheme);
	const mode = useThemeStore((s) => s.mode);
	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.up("sm"));

	useEffect(() => {
		const authUser = async () => {
			const res = await UserServices.isAuth();
			if (res) {
				navigator(`/auth/feed/`);
			}
		};

		authUser();
	}, [navigator]);

	const linkProps = {
		color: mode === "dark" ? "secondary.light" : "primary.dark",
		sx: {
			"textDecoration": "none",
			"transition": "border-bottom 2s, border-color 2s",
			"&:hover": {
				borderBottom: "2px solid",
				borderColor: "secondary.light",
			},
		},
	};

	return (
		<>
			<List
				sx={{
					width: "100%",
					height: "80px",
					zIndex: "1000",
					overflow: "hidden",
					display: "flex",
					boxSizing: "border-box",
					flexDirection: "row",
					position: "absolute",
					top: 0,
					left: 0,
					marginY: 2,
				}}>
				<ListItem>
					<IconButton href="/" onClick={toggleTheme}>
						<LogoIcon size="3em" />
					</IconButton>
				</ListItem>
				{matches ? (
					<>
						<ListItem>
							<Link {...linkProps} href="/#about">
								{" "}
								About{" "}
							</Link>
						</ListItem>
						<ListItem>
							<Link {...linkProps} href="/#features">
								{" "}
								Features{" "}
							</Link>
						</ListItem>
						<ListItem>
							<Link {...linkProps} href="/#faqs">
								{" "}
								FAQs{" "}
							</Link>
						</ListItem>
					</>
				) : (
					<ListItem>
						<Link {...linkProps} href="/">
							{" "}
							Home{" "}
						</Link>
					</ListItem>
				)}
				<ListItem sx={{ display: "flex", gap: 2 }}>
					<Stack gap={4} justifyContent={"end"} flexDirection={"row"}>
						<Button
							variant="contained"
							sx={{ textWrap: "nowrap" }}
							href="/signup">
							Join Now
						</Button>
						<Button variant="contained" color={"secondary"} href="/login">
							Login
						</Button>
					</Stack>
				</ListItem>
			</List>
			<Outlet />
		</>
	);
};

export default GuestLayout;
