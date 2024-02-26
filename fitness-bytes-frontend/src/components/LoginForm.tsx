import {
	Alert,
	Button,
	FormControl,
	Link,
	Stack,
	TextField,
} from "@mui/material";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useUserStore from "../hooks/useUserStore";
import ClientService from "../services/ClientService";
import { FormData } from "../services/SignupValidatorService";
import PasswordInput from "./PasswordInput";

interface LoginResponse {
	token: string;
	userId: string;
}

const LoginForm = () => {
	const { setUser, username, _id } = useUserStore();
	const [failedLogin, setFailedLogin] = useState(false);
	const [, setCookie] = useCookies(["token"]);
	const { register, handleSubmit } = useForm<FormData>();
	const navigator = useNavigate();

	async function handleLogin(data: FormData) {
		const client = new ClientService<LoginResponse>("user/login");

		try {
			const response = await client.post(data);
			const { userId, token } = response.result || ({} as LoginResponse);

			// Store token in cookie upon successful login
			setCookie("token", token, { path: "/" });
			setUser(userId, data.username);

			navigator("/auth/feed/" + data.username);
		} catch {
			setFailedLogin(true);
		}
	}

	return (
		<form onSubmit={handleSubmit((data) => handleLogin(data))}>
			<Stack sx={{ flexDirection: "column", gap: "1.2rem" }}>
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
						variant="contained"
						color="secondary"
						size="large"
						type="submit">
						Log In
					</Button>
					<Link
						display="inline"
						href="/signup"
						variant="overline"
						underline="hover">
						Don't have an account yet?
					</Link>
				</Stack>
			</Stack>
		</form>
	);
};

export default LoginForm;
