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
	Stack,
	Switch,
	Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import PageSpinner from "../components/PageSpinner";
import useBannerStore from "../hooks/useBannerStore";
import useThemeStore from "../hooks/useThemeStore";
import useUserConfig from "../hooks/useUserConfig";
import UserConfigServices, { userConfig } from "../services/UserConfigServices";

const AccountSettings = () => {
	const setBanner = useBannerStore((s) => s.setBanner);
	const mode = useThemeStore((s) => s.mode);
	const toggleTheme = useThemeStore((s) => s.toggleTheme);
	const [isNotificationAlterted, setNotificationAlerted] = useState(false);
	const notificationChanged = () => {
		setNotificationAlerted(true);
	};
	const queryClient = useQueryClient();

	const { data: userConfig, isLoading: userConfigIsLoading } = useUserConfig();

	if (userConfigIsLoading) return <PageSpinner />;

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
										checked={userConfig?.friend}
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
				<FormGroup sx={{ padding: 2 }}>
					<FormControlLabel
						control={
							<Switch
								onChange={toggleTheme}
								color="secondary"
								defaultChecked={mode === "dark"}
							/>
						}
						label={
							<Stack flexDirection={"row"} gap={1}>
								<Typography fontWeight={"600"}>Dark Mode</Typography>
								{mode === "light" ? (
									<DarkModeIcon color="primary" />
								) : (
									<DarkModeOutlinedIcon color="primary" />
								)}
							</Stack>
						}
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
			<Stack borderRadius={"25px"} alignItems={"center"} padding={2}>
				<ButtonGroup
					orientation="vertical"
					sx={{ gap: 2, maxWidth: "550px", width: "80%" }}>
					<Button variant="contained" color={"primary"}>
						Change Username
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
