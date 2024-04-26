import { Stack, Typography } from "@mui/material";
import LogoName from "../components/LogoName";
import SignupForm from "../components/SignupForm";

const Signup = () => {
	return (
		<Stack
			width={"100%"}
			height={"100%"}
			position={"absolute"}
			top={"50%"}
			left={"50%"}
			padding={4}
			paddingTop={"100px"}
			flexDirection={{ xs: "column", sm: "row" }}
			justifyContent={"center"}
			alignItems={"center"}
			gap={2}
			sx={{ transform: "translateX(-50%) translateY(-50%)" }}>
			<Stack maxWidth={{ lg: "400px" }} width={"100%"} marginX={"auto"}>
				<LogoName />
				<Typography variant="h5" component="h3">
					A social network for pump chasers, improvement seekers, and gym lovers
				</Typography>
			</Stack>
			<Stack maxWidth={{ lg: "600px" }} width={"100%"} marginX={"auto"}>
				<SignupForm />
			</Stack>
		</Stack>
	);
};

export default Signup;
