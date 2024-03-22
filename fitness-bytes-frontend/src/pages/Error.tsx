import ErrorIcon from "@mui/icons-material/Error";
import {
	Divider,
	Grid,
	Link,
	List,
	ListItem,
	Stack,
	Typography,
} from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import LogoIcon from "../components/LogoIcon";

const Error = () => {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<Grid>
				<LogoIcon size="6rem" />
				<Grid
					item
					paddingTop={-1}
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						paddingX: { xs: 0, xl: 10 },
						minHeight: "min-content",
						margin: "auto",
					}}
					width={{ xs: "100%", lg: "80%" }}
					gap={4}>
					<Stack marginTop={5} gap={4}>
						<Typography textAlign={"center"} variant="h2">
							{error.status}: {error.statusText}
						</Typography>
						{error.data?.message && (
							<Typography variant="body1">{error.data.message}</Typography>
						)}
						<Divider orientation="horizontal" variant="middle" flexItem>
							<ErrorIcon />
						</Divider>
						<Grid container columns={{ xs: 1, md: 2 }}>
							<Grid item margin={"auto"} maxWidth={"400px"} xs={1}>
								<Typography
									letterSpacing={1.05}
									lineHeight={0.95}
									variant="h4"
									component="h2">
									Oops, sometimes we make mistakes.
								</Typography>
								<Typography
									letterSpacing={1.01}
									variant="h5"
									component="h3"
									lineHeight={0.95}
									paddingY={4}>
									We apologize that you've ecountered this!
								</Typography>
							</Grid>
							<Grid item margin={"auto"} padding={0} maxWidth={"400px"} xs={1}>
								<List
									sx={{
										"fontSize": "1.2rem",
										"& .MuiListItem-root": {
											display: "list-item",
										},
									}}
									subheader={
										"Here are some helpful links to get you where you want to go!"
									}>
									<ListItem>
										<Typography>
											Start fresh with us at the{" "}
											<Link color={"secondary"} href="/">
												Home
											</Link>{" "}
											page
										</Typography>
									</ListItem>
									<ListItem>
										<Typography>
											A returning user,{" "}
											<Link href="/login" color={"secondary"}>
												Login
											</Link>
											!
										</Typography>
									</ListItem>
									<ListItem>
										<Typography>
											Ready to{" "}
											<Link href="/login" color={"secondary"}>
												sign up
											</Link>
											?
										</Typography>
									</ListItem>
								</List>
							</Grid>
						</Grid>
					</Stack>
				</Grid>
			</Grid>
		);
	} else {
		return (
			<Typography variant="h1">Something unexpected has occured</Typography>
		);
	}
};

export default Error;
