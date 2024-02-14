import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReportIcon from "@mui/icons-material/Report";
import ShareIcon from "@mui/icons-material/Share";

import {
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from "@mui/material";

const MoreOptionsItems = [
	{
		component: <DeleteIcon />,
		text: "Delete",
	},
	{
		component: <EditIcon />,
		text: "Edit",
	},
	{
		component: <ShareIcon />,
		text: "Share",
	},
	{
		component: <ReportIcon />,
		text: "Report",
	},
];

const MoreOptions = () => {
	// State to control the anchor element for the menu (null when closed)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	// Open the menu
	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	// Close the menu
	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<IconButton onClick={handleMenuOpen}>
				<MoreHorizIcon aria-label="more option for this post" />
			</IconButton>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}>
				{MoreOptionsItems.map(({ component, text }) => (
					<MenuItem key={text} onClick={handleMenuClose}>
						<ListItemIcon>{component}</ListItemIcon>
						<ListItemText>{text}</ListItemText>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default MoreOptions;
