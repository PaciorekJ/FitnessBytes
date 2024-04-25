import { Button, Link, List, ListItem, Stack } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LogoIcon from "../components/LogoIcon";
import UserServices from "../services/UserServices";

const GuestLayout = () => {
	const navigator = useNavigate();

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
		color: "secondary.light",
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
					display: "flex",
					boxSizing: "border-box",
					flexDirection: "row",
					position: "absolute",
					top: 0,
					left: 0,
					padding: 2,
				}}>
				<ListItem>
					<LogoIcon size="5em" />
				</ListItem>
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
				<ListItem sx={{ display: "flex", gap: 2 }}>
					<Stack gap={4} justifyContent={"end"} flexDirection={"row"}>
						<Button
							variant="contained"
							sx={{ textWrap: "nowrap" }}
							size="medium"
							href="/signup/">
							Join Now
						</Button>
						<Button variant="contained" color={"secondary"} href="/signup/">
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
