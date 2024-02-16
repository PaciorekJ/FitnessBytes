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
		requireOwnership: true,
	},
	{
		component: <EditIcon />,
		text: "Edit",
		requireOwnership: true,
	},
	{
		component: <ShareIcon />,
		text: "Share",
		requireOwnership: false,
	},
	{
		component: <ReportIcon />,
		text: "Report",
		requireOwnership: false,
	},
];

interface Props {
	isOwner: boolean;
}

const MoreOptions = ({ isOwner }: Props) => {
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
				{MoreOptionsItems.map(({ component, text, requireOwnership }) => {
					if ((requireOwnership && isOwner) || !requireOwnership) {
						return (
							<MenuItem key={text} onClick={handleMenuClose}>
								<ListItemIcon>{component}</ListItemIcon>
								<ListItemText>{text}</ListItemText>
							</MenuItem>
						);
					}

					return null;
				})}
			</Menu>
		</>
	);
};

export default MoreOptions;
