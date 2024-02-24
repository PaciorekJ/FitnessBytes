import { Logout, Settings } from "@mui/icons-material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import HomeIcon from "@mui/icons-material/Home";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
	Avatar,
	Badge,
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Paper,
	Stack,
	Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useThemeStore from "../hooks/useThemeStore";
import AddFriend from "./AddFriend";
import ComposePost from "./ComposePost";
import LogoIcon from "./LogoIcon";

const Nav = () => {
	const { mode, toggleTheme } = useThemeStore();
	const { username } = useParams();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Stack zIndex={"100"} height={"10vh"}>
			<Paper square>
				<Stack
					sx={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						paddingX: "1",
						paddingY: ".2rem",
					}}>
					<LogoIcon size="2.5rem" />
					<Box>
						<ComposePost />
						<AddFriend />
						<Tooltip title="Color Mode">
							<IconButton onClick={toggleTheme}>
								{mode === "light" ? (
									<DarkModeIcon color="primary" />
								) : (
									<DarkModeOutlinedIcon color="primary" />
								)}
							</IconButton>
						</Tooltip>
						<Tooltip title="Notifications">
							<IconButton>
								<Badge badgeContent={10} variant="dot" color="secondary">
									<NotificationsNoneIcon color="primary" />
								</Badge>
							</IconButton>
						</Tooltip>
						<Tooltip title="Messages">
							<IconButton href={`/auth/messages/${username}`}>
								<Badge badgeContent={10} color="secondary">
									<MailOutlinedIcon color="primary" />
								</Badge>
							</IconButton>
						</Tooltip>
						<Tooltip title="My Groups">
							<IconButton>
								<Diversity3Icon color="primary" />
							</IconButton>
						</Tooltip>
						<Tooltip title="Home">
							<IconButton href={`/auth/feed/${username}#top`}>
								<HomeIcon color="primary" />
							</IconButton>
						</Tooltip>
						<IconButton
							onClick={handleClick}
							size="small"
							aria-controls={open ? "account-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={open ? "true" : undefined}>
							<Avatar
								sx={{
									md: { width: "12px", height: "12px" },
								}}
							/>
						</IconButton>
						<Menu
							sx={{
								overflow: "visible",
								filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.32))",
								marginTop: "1.5rem",
							}}
							anchorEl={anchorEl}
							id="account-menu"
							open={open}
							onClose={handleClose}
							onClick={handleClose}
							anchorOrigin={{
								horizontal: "right",
								vertical: "bottom",
							}}>
							<MenuItem
								sx={{ gap: "10px" }}
								href={`/auth/account/${username}#top`}
								onClick={handleClose}>
								<ListItemIcon>
									<Avatar />
								</ListItemIcon>
								Profile
							</MenuItem>
							<Divider />
							<MenuItem onClick={handleClose}>
								<ListItemIcon>
									<Settings fontSize="small" />
								</ListItemIcon>
								Manage Account
							</MenuItem>
							<MenuItem onClick={handleClose}>
								<ListItemIcon>
									<Logout fontSize="small" />
								</ListItemIcon>
								Logout
							</MenuItem>
						</Menu>
					</Box>
				</Stack>
			</Paper>
		</Stack>
	);
};

export default Nav;
