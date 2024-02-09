import { Stack, Typography } from "@mui/material";
import LoginForm from "../../components/LoginForm";
import LogoName from "../../components/LogoName";
import "./index.css";

const Login = () => {
	return (
		<Stack gap={4} padding={10} alignItems={"center"}>
			<Stack>
				<Typography
					marginBottom={0}
					textAlign={"center"}
					variant="h3"
					gutterBottom>
					Welcome to
				</Typography>
				<LogoName center />
			</Stack>
			<LoginForm />
		</Stack>
	);
};

export default Login;
