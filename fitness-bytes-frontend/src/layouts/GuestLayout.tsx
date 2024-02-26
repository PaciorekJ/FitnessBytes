import { Grid, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import LogoIcon from "../components/LogoIcon";

const GuestLayout = () => {
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
