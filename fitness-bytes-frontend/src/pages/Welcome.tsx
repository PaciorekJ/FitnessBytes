import { Button, Stack, Typography } from "@mui/material";
import LogoName from "../components/LogoName";

const Welcome = () => {
	return (
		<Stack gap={2} margin={"auto"}>
			<LogoName center />
			<Typography textAlign={"center"} variant={"h3"} fontSize={24}>
				A Community that's fit for you! Here to help bit by bit
			</Typography>
			<Button href="/signup" size="large" variant="contained">
				Get Started
			</Button>
			<Button href="/login" size="large" color="secondary" variant="outlined">
				Log in
			</Button>
		</Stack>
	);
};

export default Welcome;
