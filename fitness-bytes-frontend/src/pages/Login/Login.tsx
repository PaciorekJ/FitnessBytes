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

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { isDirty, errors, isValid },
	} = useForm<LoginData>();

	async function handleLogin(data: LoginData) {
		const client = new ClientService<LoginResponse>("user/login");

		const { token } = await client.post(data);

		localStorage.setItem("token", token);
	}

	return (
		<Grid container>
			<Typography>{localStorage.getItem("token")}</Typography>
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
					<FormControl>
						<TextField
							id="username"
							fullWidth
							variant="outlined"
							label="Username"
							{...register("username", { required: true, minLength: 10 })}
						/>
						{errors.username?.type && (
							<Alert severity="error">{errors.username?.type as string}</Alert>
						)}
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
						{errors.password?.type && (
							<Alert severity="error">{errors.password?.type as string}</Alert>
						)}
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
						<Link href="/createAccount" variant="overline" underline="hover">
							Don't have an account yet?
						</Link>
					</Stack>
				</form>
			</Stack>
		</Grid>
	);
};

export default Login;
