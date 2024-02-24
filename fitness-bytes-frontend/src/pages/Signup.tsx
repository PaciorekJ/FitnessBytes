import { Grid, Typography } from "@mui/material";
import LogoName from "../components/LogoName";
import SignupForm from "../components/SignupForm";

const Signup = () => {
	return (
		<Grid
			minHeight="min-content"
			width="100vw"
			container
			columns={{ xs: 1, md: 2 }}
			gap={2}
			paddingTop={{ xs: "200px" }}
			padding={{ xs: 1, md: 5, lg: 10 }}>
			<Grid
				item
				maxWidth="400px"
				sx={{
					width: "100%",
					margin: "auto",
				}}>
				<LogoName />
				<Typography variant="h5" component="h2">
					A social network for pump chasers, improvement seekers, and gym lovers
				</Typography>
			</Grid>
			<Grid
				item
				maxWidth="400px"
				sx={{
					width: "100%",
					margin: "auto",
				}}>
				<SignupForm />
			</Grid>
		</Grid>
	);
};

export default Signup;
