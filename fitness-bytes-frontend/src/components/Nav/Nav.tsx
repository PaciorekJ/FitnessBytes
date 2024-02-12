import { Logout, Settings } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import {
	Avatar,
	Box,
	Divider,
	FormControl,
	IconButton,
	InputLabel,
	ListItemIcon,
	Menu,
	MenuItem,
	Paper,
	Select,
	SelectChangeEvent,
	Stack,
	Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import LogoIcon from "../LogoIcon";
import styles from "./index.module.css";

const Nav = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sort, setSort] = useState("Newest");
	const open = Boolean(anchorEl);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChange = (event: SelectChangeEvent) => {
		setSort(event.target.value as string);
		console.log(("Selected: " + event.target.value) as string);
		handleClose();
	};

	return (
		<Stack zIndex={"100"} height={"10vh"} position={"sticky"} top={0}>
			<Paper>
				<Stack
					flexDirection={"row"}
					justifyContent={"space-between"}
					alignItems={"center"}>
					<LogoIcon sizes="3rem" />
					<Box>
						<a href="#top">
							<IconButton>
								<HomeIcon color="primary"></HomeIcon>
							</IconButton>
						</a>
						<Tooltip title="Account settings">
							<IconButton
								onClick={handleClick}
								size="small"
								sx={{ ml: 2 }}
								aria-controls={open ? "account-menu" : undefined}
								aria-haspopup="true"
								aria-expanded={open ? "true" : undefined}>
								<Avatar sx={{ width: 48, height: 48 }}></Avatar>
							</IconButton>
						</Tooltip>
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
							<MenuItem className={styles.menuItemSpace} onClick={handleClose}>
								<ListItemIcon>
									<Avatar />
								</ListItemIcon>
								<p>My account</p>
							</MenuItem>
							<MenuItem className={styles.menuItemSpace} onClick={handleClose}>
								<ListItemIcon>
									<Avatar />
								</ListItemIcon>
								<p>My Feed</p>
							</MenuItem>
							<Divider />
							<MenuItem>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-label">Sort By</InputLabel>
									<Select
										labelId="demo-simple-select-label"
										id="demo-simple-select"
										value={sort}
										label="Sort By"
										onChange={handleChange}>
										<MenuItem value={"newest"}>Newest</MenuItem>
										<MenuItem value={"most-liked"}>Most Liked</MenuItem>
										<MenuItem value={"liked"}>Liked</MenuItem>
									</Select>
								</FormControl>
							</MenuItem>
							<Divider />
							<MenuItem onClick={handleClose}>
								<ListItemIcon>
									<Settings fontSize="small" />
								</ListItemIcon>
								Settings
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
