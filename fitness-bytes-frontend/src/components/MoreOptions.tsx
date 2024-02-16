import { useState } from "react";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import {
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
} from "@mui/material";

interface MoreOptionsItemProps {
	component: JSX.Element;
	text: string;
	requireOwnership: boolean;
	onClick?: React.MouseEventHandler<HTMLLIElement>;
}
interface Props {
	isOwner: boolean;
	menuItems: MoreOptionsItemProps[];
}

const MoreOptions = ({ isOwner, menuItems }: Props) => {
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
				{menuItems
					.filter((item) => isOwner || !item.requireOwnership)
					.map((item, i) => (
						<MenuItem
							key={i}
							onClick={(e) => {
								if (item.onClick) item.onClick(e);
								handleMenuClose();
							}}>
							<ListItemIcon>{item.component}</ListItemIcon>
							<ListItemText>{item.text}</ListItemText>
						</MenuItem>
					))}
			</Menu>
		</>
	);
};

export default MoreOptions;
