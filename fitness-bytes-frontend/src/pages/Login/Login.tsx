import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Alert,
	Button,
	FormControl,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	Link,
	OutlinedInput,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../../components/Logo";
import LoginData from "../../interfaces/LoginData";
import LoginResponse from "../../interfaces/LoginResponse";
import ClientService from "../../services/ClientService";
import "./index.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [failedLogin, setFailedLogin] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { isDirty, errors, isValid },
	} = useForm<LoginData>();

	const navigator = useNavigate();

	interface D {
		response: {
			status: number;
		};
	}

	async function handleLogin(data: LoginData) {
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
		<Grid container>
			<Stack
				margin={"auto"}
				gap={4}
				minWidth={{ xs: "300px", sm: "500px", md: "800px" }}
				paddingY={10}>
				<Stack>
					<Typography
						marginBottom={0}
						textAlign={"center"}
						variant="h3"
						gutterBottom>
						Sign In to
					</Typography>
					<Logo />
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
						<InputLabel htmlFor="password">Password</InputLabel>
						<OutlinedInput
							id="password"
							fullWidth
							{...register("password", { required: true, minLength: 10 })}
							type={showPassword ? "text" : "password"}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword(!showPassword)}
										edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
							label="Password"
						/>
					</FormControl>
					<Stack>
						<Button
							disabled={!isValid || !isDirty}
							variant="contained"
							color="secondary"
							size="large"
							type="submit">
							Log in
						</Button>
						<Link href="/signup" variant="overline" underline="hover">
							Don't have an account yet?
						</Link>
					</Stack>
				</form>
			</Stack>
		</Grid>
	);
};

export default Login;
