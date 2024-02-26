import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import CloseIcon from "@mui/icons-material/Close";
import {
	Alert,
	Button,
	FormControl,
	Link,
	Stack,
	TextField,
} from "@mui/material";
import { UseFormProps, useForm } from "react-hook-form";
import { AuthData } from "../services/SignupValidatorService";
import PasswordInput from "./PasswordInput";

import { schema } from "../services/SignupValidatorService";

interface FormAlertState {
	state: boolean;
	message: string;
}

interface FormButtonProps {
	text: string;
}

interface FormLinkProps {
	text: string;
	href: string;
}

interface Props {
	formAction: (data: AuthData) => void;
	monitorFormValidity?: boolean;
	formButton: FormButtonProps;
	formLink: FormLinkProps;
	formAlertState?: FormAlertState;
}

const AuthForm = ({
	formAction,
	formButton,
	formLink,
	monitorFormValidity = true,
	formAlertState = { state: false, message: "" },
}: Props) => {
	const formOptions: UseFormProps<AuthData> = monitorFormValidity
		? { resolver: zodResolver(schema), mode: "onChange" }
		: {};

	const {
		register,
		handleSubmit,
		formState: { isDirty, errors, isValid },
	} = useForm<AuthData>(formOptions);

	return (
		<form
			onSubmit={handleSubmit((data) => {
				console.log(data);
				formAction(data);
			})}>
			<Stack sx={{ flexDirection: "column", gap: "1.2rem" }}>
				{formAlertState.state && (
					<Alert severity="error">{formAlertState.message}</Alert>
				)}
				<FormControl>
					<TextField
						id="username"
						fullWidth
						variant="outlined"
						label="Username"
						{...register("username", { required: true })}
					/>
					{monitorFormValidity && errors.username && (
						<Alert
							icon={<CloseIcon fontSize="inherit" color="error" />}
							severity="error">
							{errors.username.message}
						</Alert>
					)}
				</FormControl>
				<FormControl>
					<PasswordInput register={register} options={{ required: true }} />
					{monitorFormValidity && errors.password && (
						<Alert
							icon={<CloseIcon fontSize="inherit" color="error" />}
							severity="error">
							{errors.password.message}
						</Alert>
					)}
				</FormControl>
				<Stack>
					<Button
						variant="contained"
						disabled={monitorFormValidity && (!isValid || !isDirty)}
						color="secondary"
						size="large"
						type="submit">
						{formButton.text}
					</Button>
					<Link
						display="inline"
						href={formLink.href}
						variant="overline"
						underline="hover">
						{formLink.text}
					</Link>
				</Stack>
			</Stack>
		</form>
	);
};

export default AuthForm;
