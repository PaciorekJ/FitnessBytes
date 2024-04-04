import { CircularProgress, Stack, SxProps } from "@mui/material";

const PageSpinner = (sx: SxProps = {}) => {
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
				sx={{ marginTop: "20vh", ...sx }}
				size={"50px"}
				color="secondary"
			/>
		</Stack>
	);
};

export default PageSpinner;
