import { Grid, Stack } from "@mui/material";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import LogoIcon from "../components/LogoIcon";
import UserServices from "../services/UserServices";

const GuestLayout = () => {
	const navigator = useNavigate();

	useEffect(() => {
		const authUser = async () => {
			const client = new UserServices();
			try {
				const username = await client.isAuth();
				navigator(`/auth/feed/${username}`);
			} catch {
				return;
			}
		};

		authUser();
	}, [navigator]);

	return (
		<>
			<Stack alignItems={"center"} paddingTop={1}>
				<LogoIcon size="8em" />
			</Stack>
			<Grid
				container
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "100%",
				}}>
				<Outlet />
			</Grid>
		</>
	);
};

export default GuestLayout;
