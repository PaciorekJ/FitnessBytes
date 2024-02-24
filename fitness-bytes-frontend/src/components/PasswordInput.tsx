import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
} from "@mui/material";
import { useState } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { FormData } from "../services/SignupValidatorService";

interface Props {
	register: UseFormRegister<FormData>;
	options?: RegisterOptions<FormData, "password"> | undefined;
}

// TODO: Add Passport to handle the login
const PasswordInput = ({ register, options }: Props) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<>
			<InputLabel>Password</InputLabel>
			<OutlinedInput
				id="password"
				fullWidth
				{...register("password", { ...options })}
				type={showPassword ? "text" : "password"}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="toggle password visibility"
							onClick={() => setShowPassword(!showPassword)}
							edge="end">
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				}
				label="Password"
			/>
		</>
	);
};

export default PasswordInput;
