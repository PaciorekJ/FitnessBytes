import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../hooks/useUserStore";
import { AuthData } from "../services/AuthValidatorService";
import UserServices from "../services/UserServices";
import AuthForm from "./AuthForm";

const LoginForm = () => {
	const { setUser } = useUserStore();
	const [failedLogin, setFailedLogin] = useState(false);
	const navigator = useNavigate();

	async function handleLogin(data: AuthData) {
		const client = new UserServices();

		try {
			await client.login(data);
		}
		catch {
			setFailedLogin(true);
			return;
		}

		setUser(data.username);
		navigator("/auth/feed/" + data.username);
	}

	return (
		<>
			<AuthForm
				formAction={handleLogin}
				formButton={{
					text: "Log In",
				}}
				formLink={{
					text: "Don't have an account yet?",
					href: "/signup",
				}}
				monitorFormValidity={false}
				formAlertState={{
					state: failedLogin,
					message: "Invalid Username or Password",
				}}
			/>
		</>
	);
};

export default LoginForm;
