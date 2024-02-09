import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import CloseIcon from "@mui/icons-material/Close";
import {
	Alert,
	Button,
	FormControl,
	Stack,
	TextField,
	Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormData, schema } from "../../services/ValidatorService";
import ClientService from "../../services/ClientService";
import PasswordInput from "../PasswordInput";
import styles from "./index.module.css";

const SignupForm = () => {
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
		<form
			className={styles.stack}
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
					display="inline"
					href="/login"
					variant="overline"
					underline="hover">
					Already have an account?
				</Link>
			</Stack>
		</form>
	);
};

export default SignupForm;
