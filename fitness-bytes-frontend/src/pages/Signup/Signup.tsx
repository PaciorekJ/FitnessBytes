import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import CloseIcon from "@mui/icons-material/Close";
import {
	Alert,
	Button,
	FormControl,
	Grid,
	Link,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/Logo";
import PasswordInput from "../../components/PasswordInput";
import ClientService from "../../services/ClientService";
import { FormData, schema } from "../../services/ValidatorService";
import "./index.css";

const Signup = () => {
	const {
		register,
		handleSubmit,
		formState: { isDirty, errors, isValid },
	} = useForm<FormData>({ resolver: zodResolver(schema), mode: "onChange" });

	const navigator = useNavigate();

	async function handleSignup(data: FormData) {
		const client = new ClientService<FormData>("user/signup");

		try {
			await client.post(data);
			navigator("/login");
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<Grid
			container
			columns={{ xs: 1, xl: 2 }}
			margin={"auto"}
			gap={4}
			paddingY={10}>
			<Grid item xs xl>
				<Stack>
					<Logo />
					<Typography fontSize={"1.5rem"} variant={"h2"}>
						A social network for pump chasers, improvement seekers, and gym
						lovers
					</Typography>
				</Stack>
			</Grid>
			<Grid item xs xl>
				<form
					className="stack"
					onSubmit={handleSubmit((data) => handleSignup(data))}>
					<FormControl>
						<TextField
							id="username"
							fullWidth
							variant="outlined"
							label="Username"
							{...register("username", { required: true })}
						/>
						{errors.username && (
							<Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
								{errors.username.message}
							</Alert>
						)}
					</FormControl>
					<FormControl>
						<PasswordInput register={register} options={{ required: true }} />
						{errors.password && (
							<Alert icon={<CloseIcon fontSize="inherit" />} severity="error">
								{errors.password.message}
							</Alert>
						)}
					</FormControl>
					<Stack>
						<Button
							disabled={!isValid || !isDirty}
							variant="contained"
							color="secondary"
							size="large"
							type="submit">
							Signup
						</Button>
						<Link
							display={"inline"}
							href="/login"
							variant="overline"
							underline="hover">
							Already have an account?
						</Link>
					</Stack>
				</form>
			</Grid>
		</Grid>
	);
};

export default Signup;
