import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
} from "@mui/material";
import { useState } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";
import UserData from "../interfaces/LoginData";

interface Props {
	register: UseFormRegister<UserData>;
	options?: RegisterOptions<UserData, "password"> | undefined;
}

const PasswordInput = ({ register, options }: Props) => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<>
			<InputLabel htmlFor="password">Password</InputLabel>
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
