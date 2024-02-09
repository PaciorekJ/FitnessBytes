import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import LogoIcon from "../components/LogoIcon";

const GuestLayout = () => {
	return (
		<div>
			<LogoIcon centerScreen />
			<Grid
				container
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					paddingX: { xs: 0, xl: 10 },
					minHeight: "min-content",
					margin: "auto",
					width: "100%",
				}}>
				<Outlet />
			</Grid>
		</div>
	);
};

export default GuestLayout;
