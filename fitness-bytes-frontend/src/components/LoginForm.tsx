import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import useUserStore from "../hooks/useUserStore";
import ClientService from "../services/ClientService";
import { FormData } from "../services/SignupValidatorService";
import AuthForm from "./AuthForm";

interface LoginResponse {
	token: string;
	userId: string;
}

const LoginForm = () => {
	const { setUser } = useUserStore();
	const [failedLogin, setFailedLogin] = useState(false);
	const [, setCookie] = useCookies(["token"]);
	const navigator = useNavigate();

	async function handleLogin(data: FormData) {
		const client = new ClientService<LoginResponse>("user/login");

		try {
			const response = await client.post(data);
			const { userId, token } = response.result || ({} as LoginResponse);

			// Store token in cookie upon successful login
			setCookie("token", token, { path: "/" });
			setUser(userId, data.username);

			navigator("/auth/feed/" + data.username);
		} catch {
			setFailedLogin(true);
		}
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
