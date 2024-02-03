import {
	Button,
	Container,
	FormControl,
	Link,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Logo from "../../components/Logo";
import PasswordInput from "../../components/PasswordInput";
import UserData from "../../interfaces/LoginData";
import "./index.css";
import ContainerWrapper from "../../components/ContainerWrapper";

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
		<ContainerWrapper>
			<Container>
				<Logo />
				<Typography fontSize={"1.5rem"} variant={"h2"}>
					A social network for pump chasers, improvement seekers, and gym lovers
				</Typography>
			</Container>
			<Container>
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
			</Container>
		</ContainerWrapper>
	);
};

export default Signup;
