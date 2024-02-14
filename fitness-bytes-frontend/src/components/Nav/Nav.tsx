import { Logout, Settings } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import {
	Avatar,
	Box,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Paper,
	Stack,
	Tooltip,
	Badge,
} from "@mui/material";
import React, { useState } from "react";
import LogoIcon from "../LogoIcon";
import styles from "./index.module.css";
import { useParams } from "react-router-dom";
import ComposePost from "../ComposePost";

const Nav = () => {
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
		<Stack zIndex={"100"} height={"10vh"} position={"sticky"} top={0}>
			<Paper square>
				<Stack
					flexDirection={"row"}
					justifyContent={"space-between"}
					alignItems={"center"}
					paddingX={1}
					paddingY={".2rem"}>
					<LogoIcon sizes="2.5rem" />
					<Box>
						<ComposePost />
						<Tooltip title="Add a Friend">
							<IconButton>
								<PersonAddOutlinedIcon color="primary" />
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
							<IconButton>
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
							anchorEl={anchorEl}
							id="account-menu"
							open={open}
							onClose={handleClose}
							onClick={handleClose}
							anchorOrigin={{
								horizontal: "right",
								vertical: "bottom",
							}}
							className={styles.menu}>
							<MenuItem
								href={`/auth/account/${username}#top`}
								className={styles.menuItemSpace}
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
