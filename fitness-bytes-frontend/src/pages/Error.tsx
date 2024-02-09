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
import LogoName from "../components/LogoName";

const Error = () => {
	const error = useRouteError();

	if (isRouteErrorResponse(error)) {
		return (
			<Stack paddingTop={4} maxWidth={"100%"} gap={4}>
				<LogoName center />
				<Stack gap={4}>
					<Typography textAlign={"center"} variant="h2">
						{error.status}: {error.statusText}
					</Typography>
					{error.data?.message && (
						<Typography variant="body1">{error.data.message}</Typography>
					)}
					<Divider orientation="horizontal" variant="middle" flexItem>
						<ErrorIcon />
					</Divider>
					<Grid container spacing={4} columns={{ xs: 1, md: 2 }}>
						<Grid item xs={1} md={1}>
							<Typography
								sx={{ fontSize: "2rem" }}
								letterSpacing={1.05}
								lineHeight={0.95}
								variant="h3">
								We are oh so human, and sometimes we make mistakes.
							</Typography>
							<Typography
								sx={{ fontSize: "1.5rem" }}
								letterSpacing={1.01}
								variant="h4"
								lineHeight={0.95}
								paddingTop={4}>
								We apologize that you've ecountered this!
							</Typography>
						</Grid>
						<Grid item xs={1} md={1}>
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
										<Link sx={{ color: "var(--color-accent)" }} href="/">
											Home
										</Link>{" "}
										page
									</Typography>
								</ListItem>
								<ListItem>
									<Typography>
										A returning user? Go to the{" "}
										<Link sx={{ color: "var(--color-accent)" }} href="/login">
											Login
										</Link>{" "}
										page
									</Typography>
								</ListItem>
								<ListItem>
									Ready to get signed up? Check out the{" "}
									<Link sx={{ color: "var(--color-accent)" }} href="/signup">
										Signup
									</Link>{" "}
									page
								</ListItem>
							</List>
						</Grid>
					</Grid>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Typography variant="h1">Something unexpected has occured</Typography>
		);
	}
};

export default Error;
