import {
	Grid,
	Stack,
	Typography
} from "@mui/material";
import Logo from "../../components/Logo";
import SignupForm from "../../components/SignupForm";
import "./index.css";

const Signup = () => {

	return (
		<Grid container paddingX={{ xs: 0, xl: 10 }} minHeight={"100vh"}>
			<Grid
				minHeight={"min-content"}
				container
				columns={{ xs: 1, xl: 2 }}
				margin={"auto"}
				gap={4}
				padding={10}>
				<Grid item xs xl>
					<Stack>
						<Logo />
						<Typography fontSize={"1.5rem"} variant={"h2"}>
							A social network for pump chasers, improvement seekers, and gym
							lovers
						</Typography>
					</Stack>
				</Grid>
				<Grid item xs xl>
					<SignupForm />
				</Grid>
			</Grid>
		</Grid>
	);
};

export default Signup;
