import DarkModeIcon from "@mui/icons-material/DarkMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
	Button,
	ButtonGroup,
	Checkbox,
	Divider,
	FormControlLabel,
	FormGroup,
	Modal,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import SwitchBase from "@mui/material/internal/SwitchBase";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageSpinner from "../components/PageSpinner";
import useBannerStore from "../hooks/useBannerStore";
import useThemeStore from "../hooks/useThemeStore";
import useUserConfig from "../hooks/useUserConfig";
import UserConfigServices, { userConfig } from "../services/UserConfigServices";
import UserServices from "../services/UserServices";

const AccountSettings = () => {
	const navigator = useNavigate();
	const setBanner = useBannerStore((s) => s.setBanner);
	const mode = useThemeStore((s) => s.mode);
	const toggleTheme = useThemeStore((s) => s.toggleTheme);
	const theme = useTheme();
	const [isNotificationAlterted, setNotificationAlerted] = useState(false);
	const notificationChanged = () => {
		setNotificationAlerted(true);
	};
	const queryClient = useQueryClient();

	// const setUser = useUserStore((s) => s.setUser);
	// const username = useUserStore((s) => s.username);
	// const [isOpenChangeUsername, setOpenChangeUsername] = useState(false);
	// const [error, setError] = useState("");
	// const {
	// 	register,
	// 	handleSubmit,
	// 	formState: { errors },
	// } = useForm<AuthUsername>({
	// 	resolver: zodResolver(usernameSchema),
	// 	mode: "onSubmit",
	// });

	const [isOpenDeleteAccount, setOpenDeleteAccount] = useState(false);

	const { data: userConfig, isLoading: userConfigIsLoading } = useUserConfig();

	if (userConfigIsLoading) return <PageSpinner />;

	const modalStyles = {
		position: "absolute",
		width: "80%",
		maxWidth: "700px",
		gap: 2,
		boxShadow: "0 0 1000px " + theme.palette.primary.light,
		background: theme.palette.background.default,
		borderRadius: "15px",
		padding: 3,
		border: "2px solid " + theme.palette.primary.main,
		top: "50%",
		left: "50%",
		transform: "translateX(-50%) translateY(-50%)",
	};

	const handleDeleteAccount = async () => {
		const res = await UserServices.delete();

		setOpenDeleteAccount(false);

		if (!res) {
			setBanner("Warning: Your Account could not be Deleted", true);
		}

		navigator("/");
	};

	// TODO: Maybe we can add this back but may not be a wise option because it could expose vulnerabilities to our server
	// const handleChangeUsername = async (data: AuthUsername) => {
	// 	if (data.username === username) {
	// 		setError("Already your username");
	// 		return;
	// 	}

	// 	const res = await UserServices.updateUsername(data.username);

	// 	if (!res) {
	// 		setError("Username Already Exists");
	//     return;
	// 	}

	// 	setUser(data.username);

	// 	setOpenChangeUsername(false);
	// };

	const handleNotificationSubmit = async (
		e: React.FormEvent<HTMLFormElement>,
	) => {
		setNotificationAlerted(false);
		e.preventDefault();
		const res = await UserConfigServices.update(userConfig!);
		if (!res) {
			setBanner(
				"An Error ocurred while updating your Notification Settings",
				true,
			);
		}
	};
	return (
		<Stack
			padding={2}
			marginBottom={2}
			gap={2}
			marginX={"auto"}
			width={{ sx: "", md: "max-content" }}>
			{/* <Modal
				open={isOpenChangeUsername}
				onClose={() => setOpenChangeUsername(false)}>
				<Stack sx={modalStyles}>
					<Typography variant="h5">Please enter your new Username</Typography>
					<form onSubmit={handleSubmit(handleChangeUsername)}>
						<Stack width={"100%"} gap={2}>
							<FormControl>
								<TextField
									id="username"
									fullWidth
									variant="outlined"
									label="Username"
									{...register("username", { required: true })}
									onChange={() => setError("")}
								/>
								{(errors.username && (
									<Alert
										icon={<CloseIcon fontSize="inherit" color="error" />}
										severity="error"
										sx={{ marginY: 2 }}>
										{errors.username.message}
									</Alert>
								)) ||
									(error && (
										<Alert
											icon={<CloseIcon fontSize="inherit" color="error" />}
											severity="error"
											sx={{ marginY: 2 }}>
											{error}
										</Alert>
									))}
							</FormControl>
							<Stack>
								<Button sx={{ margin: 0 }} variant="contained" type="submit">
									Save
								</Button>
							</Stack>
						</Stack>
					</form>
				</Stack>
			</Modal> */}
			<Modal
				open={isOpenDeleteAccount}
				onClose={() => setOpenDeleteAccount(false)}>
				<Stack sx={modalStyles}>
					<Typography variant="h5">Are you sure?</Typography>
					<Typography variant="body2" color={"error"}>
						This will remove your account forever! It will can not be recovered
					</Typography>
					<Button
						variant="contained"
						onClick={() => setOpenDeleteAccount(false)}>
						Cancel
					</Button>
					<Button
						variant="outlined"
						color={"warning"}
						onClick={handleDeleteAccount}>
						Delete My Account
					</Button>
				</Stack>
			</Modal>
			<Stack>
				<Typography variant="h2" color={"secondary"}>
					Settings
				</Typography>
				<Divider />
			</Stack>
			<Typography variant="h6" component="h3">
				Preferences
			</Typography>
			<Stack flexDirection={"row"} flexWrap={"wrap"}>
				<Stack padding={{ xs: 0, md: 2 }}>
					<Stack flexDirection={"row"} gap={1}>
						<NotificationsNoneIcon color="primary" />
						<Typography variant="body1" fontWeight={"600"} component="h4">
							Notifications
						</Typography>
					</Stack>
					<Typography
						color={isNotificationAlterted ? "error" : ""}
						variant="body2">
						You must save your changes
					</Typography>
					<form onSubmit={handleNotificationSubmit}>
						<FormGroup color="secondary" sx={{ width: "max-content" }}>
							<FormControlLabel
								control={
									<Checkbox
										id="friend"
										checked={userConfig?.friend ? true : false}
										onClick={() => {
											notificationChanged();
											queryClient.setQueryData<userConfig>(
												["userConfig"],
												(oldConfig) => {
													if (oldConfig) {
														return {
															...oldConfig,
															friend: !oldConfig.friend,
														};
													}

													return {
														reply: true,
														friend: false,
														message: true,
														like: true,
													};
												},
											);
										}}
									/>
								}
								label={"When you become friends with someone"}
							/>
							<FormControlLabel
								control={
									<Checkbox
										id="message"
										checked={userConfig?.message}
										onClick={() => {
											notificationChanged();

											queryClient.setQueryData<userConfig>(
												["userConfig"],
												(oldConfig) => {
													if (oldConfig) {
														return {
															...oldConfig,
															message: !oldConfig.message,
														};
													}

													return {
														reply: true,
														friend: true,
														message: false,
														like: true,
													};
												},
											);
										}}
									/>
								}
								label={"When you receive a message"}
							/>
							<FormControlLabel
								control={
									<Checkbox
										id="like"
										checked={userConfig?.like}
										onClick={() => {
											notificationChanged();
											queryClient.setQueryData<userConfig>(
												["userConfig"],
												(oldConfig) => {
													if (oldConfig) {
														return {
															...oldConfig,
															like: !oldConfig.like,
														};
													}

													return {
														reply: true,
														friend: true,
														message: true,
														like: false,
													};
												},
											);
										}}
									/>
								}
								label={"When someone likes your post"}
							/>
							<FormControlLabel
								control={
									<Checkbox
										id="reply"
										checked={userConfig?.reply}
										onClick={() => {
											notificationChanged();
											queryClient.setQueryData<userConfig>(
												["userConfig"],
												(oldConfig) => {
													if (oldConfig) {
														return {
															...oldConfig,
															reply: !oldConfig.reply,
														};
													}

													return {
														reply: false,
														friend: true,
														message: true,
														like: true,
													};
												},
											);
										}}
									/>
								}
								label={"When someone replies to your post "}
							/>
							<Button variant="outlined" color="secondary" type="submit">
								Save
							</Button>
						</FormGroup>
					</form>
				</Stack>
				<FormGroup
					onClick={toggleTheme}
					sx={{ padding: 2, flexDirection: "row", alignItems: "center" }}>
					<SwitchBase
						color="secondary"
						checked={mode === "dark"}
						checkedIcon={<DarkModeIcon color="primary" />}
						icon={<DarkModeOutlinedIcon color="primary" />}
					/>
					<Typography>Dark Mode</Typography>
				</FormGroup>
			</Stack>
			<Typography variant="h6" component="h3">
				Account Management
			</Typography>
			<Stack borderRadius={"25px"} alignItems={"center"} padding={2}>
				<ButtonGroup
					orientation="vertical"
					sx={{ gap: 2, maxWidth: "550px", width: "80%" }}>
					{/* <Button
						variant="contained"
						color={"primary"}
						onClick={() => setOpenChangeUsername(true)}>
						Change Username
					</Button> */}
					<Button
						color="warning"
						variant="contained"
						onClick={() => setOpenDeleteAccount(true)}>
						Permanently Delete Account
					</Button>
				</ButtonGroup>
			</Stack>
		</Stack>
	);
};

export default AccountSettings;
