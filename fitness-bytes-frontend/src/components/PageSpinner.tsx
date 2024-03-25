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
				sx={{ marginTop: "10%" }}
				size={"10%"}
				color="secondary"
			/>
		</Stack>
	);
};

export default PageSpinner;
