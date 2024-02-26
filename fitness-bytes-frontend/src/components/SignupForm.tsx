import { useNavigate } from "react-router-dom";
import ClientService from "../services/ClientService";
import { AuthData } from "../services/SignupValidatorService";
import AuthForm from "./AuthForm";

// TODO: Add Passport to handle the login
const SignupForm = () => {
	const navigator = useNavigate();

	async function handleSignup(data: AuthData) {
		const client = new ClientService<AuthData>("user/signup");

		try {
			await client.post(data);
			navigator("/login");
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<AuthForm
			formAction={handleSignup}
			monitorFormValidity={true}
			formButton={{ text: "Signup" }}
			formLink={{ text: "Already have an account?", href: "/login" }}
		/>
	);
};

export default SignupForm;
