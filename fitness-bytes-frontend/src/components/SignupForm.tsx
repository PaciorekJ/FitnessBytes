import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserServices from "../services/UserServices";
import { AuthData } from "../services/Validators/AuthValidatorService";
import AuthForm from "./AuthForm";

const SignupForm = () => {
	const [failedSignup, setFailedSignup] = useState(false);
	const navigator = useNavigate();

	async function handleSignup(data: AuthData) {
		const res = await UserServices.signup(data);

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
