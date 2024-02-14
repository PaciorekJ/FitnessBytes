import { Tooltip, IconButton, Modal, Box } from "@mui/material";
import React, { useState } from "react";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

const style = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "66%",
	bgcolor: "background.default",
	border: "2px solid #000",
	borderRadius: "10px",
	boxShadow: 24,
	p: 4,
};



const AddFriend = () => {
	const [isOpen, setOpen] = useState(false);

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	return (
		<>
			<Tooltip title="Add a Friend">
				<IconButton onClick={openModal}>
					<PersonAddOutlinedIcon color="primary" />
				</IconButton>
			</Tooltip>
			<Modal
				open={isOpen}
				onClose={closeModal}
				aria-labelledby="Modal For Posting"
				aria-describedby="Modal that is used for posting on the platform">
				<Box sx={style}></Box>
			</Modal>
		</>
	);
};

export default AddFriend;
