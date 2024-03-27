import {
	Button,
	ButtonGroup,
	Checkbox,
	Divider,
	FormControlLabel,
	FormGroup,
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import useThemeStore from "../hooks/useThemeStore";

const AccountSettings = () => {
	const mode = useThemeStore((s) => s.mode);
	const toggleTheme = useThemeStore((s) => s.toggleTheme);

	return (
		<Stack padding={2} gap={2}>
			<Stack>
				<Typography variant="h2" color={"secondary"}>
					Settings
				</Typography>
				<Divider />
			</Stack>
			<Typography variant="h6" component="h3">
				Preferences
			</Typography>
			<Stack flexDirection={"row"}>
				<Stack padding={2}>
					<Typography variant="body1" fontWeight={"600"} component="h4">
						Notifications
					</Typography>
					<Typography color={"error"} variant="body2">
						You must save your changes
					</Typography>
					<FormGroup color="secondary" sx={{ width: "max-content" }}>
						<FormControlLabel
							control={<Checkbox id="friend" />}
							label={"When you become friends with someone"}
						/>
						<FormControlLabel
							control={<Checkbox id="message" />}
							label={"When you receive a message"}
						/>
						<FormControlLabel
							control={<Checkbox id="like" />}
							label={"When someone likes your post"}
						/>
						<FormControlLabel
							control={<Checkbox id="reply" />}
							label={"When someone replies to your post "}
						/>
						<Button variant="outlined" color="secondary">
							Save
						</Button>
					</FormGroup>
				</Stack>
				<FormGroup sx={{ padding: 2 }}>
					<FormControlLabel
						control={
							<Switch
								onChange={toggleTheme}
								color="secondary"
								defaultChecked={mode === "dark"}
							/>
						}
						label="Dark Mode"
						slotProps={{
							typography: {
								fontWeight: "600",
							},
						}}
						sx={{ width: "max-content" }}
					/>
				</FormGroup>
			</Stack>
			<Typography variant="h6" component="h3">
				Account Management
			</Typography>
			<Stack
				borderRadius={"25px"}
				alignItems={{ xs: "center", md: "start" }}
				padding={2}>
				<ButtonGroup
					orientation="vertical"
					sx={{ gap: 2, maxWidth: "550px", width: "80%" }}>
					<Button variant="contained" color={"primary"}>
						Change Username
					</Button>
					<Button variant="contained" color={"secondary"} sx={{color: "white"}}>
						Reset Password
					</Button>
					<Button color="warning" variant="contained">
						Permanently Delete Account
					</Button>
				</ButtonGroup>
			</Stack>
		</Stack>
	);
};

export default AccountSettings;
