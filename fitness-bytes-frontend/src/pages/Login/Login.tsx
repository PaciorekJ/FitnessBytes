import {
	Alert,
	Button,
	FormControl,
	Link,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import PasswordInput from "../../components/PasswordInput";
import LoginResponse from "../../interfaces/LoginResponse";
import ClientService from "../../services/ClientService";
import { FormData } from "../../services/ValidatorService";
import "./index.css";

const Login = () => {
	const [failedLogin, setFailedLogin] = useState(false);
	const [, setCookie] = useCookies(["token"]);

	const {
		register,
		handleSubmit,
		formState: { isDirty, isValid },
	} = useForm<FormData>();

	const navigator = useNavigate();

	async function handleLogin(data: FormData) {
		interface D {
			response: {
				status: number;
			};
		}

		const client = new ClientService<LoginResponse>("user/login");

		try {
			const response = await client.post(data);
			const { token } = response;

			// Store token in cookie upon successful login
			setCookie("token", token, { path: "/" });

			navigator("/login/" + data.username);
		} catch (e) {
			if ((e as D).response.status === 401) {
				setFailedLogin(true);
				return;
			}

			console.error(e);
		}
	}

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
				<Logo center />
			</Stack>
			<form
				className="stack"
				onSubmit={handleSubmit((data) => handleLogin(data))}>
				{failedLogin && (
					<Alert severity="error">Invalid Username or Password</Alert>
				)}
				<FormControl>
					<TextField
						id="username"
						fullWidth
						variant="outlined"
						label="Username"
						{...register("username", { required: true })}
					/>
				</FormControl>
				<FormControl>
					<PasswordInput register={register} options={{ required: true }} />
				</FormControl>
				<Stack>
					<Button
						disabled={!isValid || !isDirty}
						variant="contained"
						color="secondary"
						size="large"
						type="submit">
						Log In
					</Button>
					<Link href="/signup" variant="overline" underline="hover">
						Don't have an account yet?
					</Link>
				</Stack>
			</form>
		</Stack>
	);
};

export default Login;
