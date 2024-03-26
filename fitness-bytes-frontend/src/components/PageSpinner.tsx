import { CircularProgress, Stack } from "@mui/material";

const PageSpinner = () => {
	return (
		<Stack
			boxSizing={"border-box"}
			width={"100%"}
			padding={2}
			margin={"auto"}
			paddingX={"5rem"}
			alignItems={"center"}>
			<div id="top"></div>
			<CircularProgress
				sx={{ marginTop: "20vh" }}
				size={"50px"}
				color="secondary"
			/>
		</Stack>
	);
};

export default PageSpinner;
