import { Stack, Typography, Button, Grid } from "@mui/material";
import Logo from "../components/Logo";

const Welcome = () => {
	return (
		<Grid
			container
			paddingTop={14}
			justifyContent={"center"}
			height={"100%"}
			gap={2}>
			<Stack gap={2} width={"75%"} maxWidth={"800px"} margin={"auto"}>
				<Logo center />
				<Typography textAlign={"center"} variant={"h3"} fontSize={24}>
					A Community that's fit for you! Here to help bit by bit
				</Typography>
				<Button href="/signup" size="large" variant="contained">
					Get Started
				</Button>
				<Button href="/login" size="large" variant="outlined">
					Log in
				</Button>
			</Stack>
		</Grid>
	);
};

export default Welcome;
