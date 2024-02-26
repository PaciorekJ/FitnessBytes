import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthData } from "../services/AuthValidatorService";
import UserServices from "../services/UserServices";
import AuthForm from "./AuthForm";

// TODO: Add Passport to handle the login
const SignupForm = () => {
	const [failedSignup, setFailedSignup] = useState(false);
	const navigator = useNavigate();

	async function handleSignup(data: AuthData) {
		const client = new UserServices();

		const res = await client.signup(data);

		if (!res) {
			setFailedSignup(true);
			return;
		}

		navigator("/login");
	}

	return (
		<AuthForm
			formAction={handleSignup}
			monitorFormValidity={true}
			formButton={{ text: "Signup" }}
			formAlertState={{
				message: "Username already exists",
				state: failedSignup,
			}}
			formLink={{ text: "Already have an account?", href: "/login" }}
		/>
	);
};

export default SignupForm;
