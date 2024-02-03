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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ContainerWrapper from "../../components/ContainerWrapper";
import Logo from "../../components/Logo";
import PasswordInput from "../../components/PasswordInput";
import UserData from "../../interfaces/LoginData";
import LoginResponse from "../../interfaces/LoginResponse";
import ClientService from "../../services/ClientService";
import "./index.css";

const Login = () => {
	const [failedLogin, setFailedLogin] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { isDirty, isValid },
	} = useForm<UserData>();

	const navigator = useNavigate();

	async function handleLogin(data: UserData) {
		interface D {
			response: {
				status: number;
			};
		}

		const client = new ClientService<LoginResponse>("user/login");

		try {
			const { token } = await client.post(data);

			localStorage.setItem("token", token);

			navigator("/feed/" + data.username);
		} catch (e) {
			if ((e as D).response.status === 401) {
				setFailedLogin(true);
				return;
			}

			console.error(e);
		}
	}

	return (
		<ContainerWrapper>
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
						{...register("username", { required: true, minLength: 10 })}
					/>
				</FormControl>
				<FormControl>
					<PasswordInput
						register={register}
						options={{ required: true, minLength: 10 }}
					/>
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
		</ContainerWrapper>
	);
};

export default Login;
