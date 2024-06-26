import {
	Button,
	IconButton,
	Link,
	List,
	ListItem,
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
			"&:hover": {
				borderBottom: "1px solid",
				borderColor: "secondary.light",
			},
		},
	};

	return (
		<>
			<List
				sx={{
					width: "100%",
					height: "100px",
					zIndex: "1000",
					overflow: "hidden",
					display: "flex",
					position: "absolute",
					top: 0,
					left: 0,
					marginY: 2,
				}}>
				<ListItem sx={{ width: "min-content" }}>
					<IconButton href="/">
						<LogoIcon size="3em" />
					</IconButton>
				</ListItem>
				{matches ? (
					<ListItem>
						<List
							sx={{
								display: "flex",
								gap: 2,
							}}>
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
						</List>
					</ListItem>
				) : (
					<ListItem>
						<Link {...linkProps} href="/">
							{" "}
							Home{" "}
						</Link>
					</ListItem>
				)}
				<ListItem sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
					<Button
						variant="contained"
						sx={{ textWrap: "nowrap" }}
						href="/signup">
						Join Now
					</Button>
					<Button variant="contained" color={"secondary"} href="/login">
						Login
					</Button>
				</ListItem>
			</List>
			<Outlet />
		</>
	);
};

export default GuestLayout;
