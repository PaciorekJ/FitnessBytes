import { Grid, Stack, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm/LoginForm";
import LogoName from "../components/LogoName";
const Login = () => {
	return (
		<Grid
			minHeight={"min-content"}
			width={{ xs: "inherit", xl: "50%" }}
			container
			columns={1}
			margin={"auto"}
			gap={4}
			padding={10}>
			<Grid item xs xl>
				<LogoName />
				<Typography variant="h5" component="h2" gutterBottom>
					Go find the community that's fit for you. Development happens bit by
					bit!
				</Typography>
				<LoginForm />
			</Grid>
		</Grid>
	);
};

export default Login;
