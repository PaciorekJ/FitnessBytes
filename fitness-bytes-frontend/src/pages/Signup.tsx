import { Grid, Typography } from "@mui/material";
import LogoName from "../components/LogoName";
import SignupForm from "../components/SignupForm/SignupForm";

const Signup = () => {
	return (
		<Grid
			minHeight={"min-content"}
			container
			gap={2}
			margin={"auto"}
			padding={10}>
			<Grid item xs lg minWidth={"350px"}>
				<LogoName />
				<Typography variant="h5" component="h2">
					A social network for pump chasers, improvement seekers, and gym lovers
				</Typography>
			</Grid>
			<Grid item xs lg minWidth={"400px"}>
				<SignupForm />
			</Grid>
		</Grid>
	);
};

export default Signup;
