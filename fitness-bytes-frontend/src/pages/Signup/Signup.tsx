import {
	Button,
	FormControl,
	Grid,
	Link,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Logo from "../../components/Logo";
import PasswordInput from "../../components/PasswordInput";
import UserData from "../../interfaces/UserData";
import "./index.css";

function handleSignup(data: UserData) {
	console.log(data);
}

const Signup = () => {
	const {
		register,
		handleSubmit,
		formState: { isDirty, isValid },
	} = useForm<UserData>();

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
