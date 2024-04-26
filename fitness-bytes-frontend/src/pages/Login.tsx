import { Grid, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm";
import LogoName from "../components/LogoName";
const Login = () => {
	return (
		<Grid
			minHeight={"min-content"}
			width={{ xs: "90%", sm: "80%", md: "70%", lg: "50%" }}
			container
			columns={1}
			margin={"auto"}
			position={"absolute"}
			top={"50%"}
			left={"50%"}
			paddingTop={"100px"}
			sx={{ transform: "translateX(-50%) translateY(-50%)" }}>
			<Grid item xs xl>
				<LogoName />
				<Typography
					fontSize={{ xs: "1.2rem", sm: "2rem" }}
					variant={"h5"}
					marginBottom={2}
					component="h2">
					Go find the community that's fit for you. Development happens bit by
					bit!
				</Typography>
				<LoginForm />
			</Grid>
		</Grid>
	);
};

export default Login;
