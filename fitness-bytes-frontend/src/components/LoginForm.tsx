import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../hooks/useUserStore";
import UserServices from "../services/UserServices";
import { AuthData } from "../services/Validators/AuthValidatorService";
import AuthForm from "./AuthForm";

const LoginForm = () => {
	const { setUser } = useUserStore();
	const [failedLogin, setFailedLogin] = useState(false);
	const navigator = useNavigate();

	async function handleLogin(data: AuthData) {
		const res = await UserServices.login(data);
		if (!res) {
			setFailedLogin(true);
			return;
		}
		setUser(res as unknown as string);
		navigator("/auth/feed/");
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
