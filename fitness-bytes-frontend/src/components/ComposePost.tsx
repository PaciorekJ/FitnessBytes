import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import {
	Avatar,
	Box,
	Button,
	CardActions,
	CardHeader,
	Divider,
	Paper,
	TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

import { useState } from "react";

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

interface Props {
	username?: string;
}

const ComposePost = ({ username = "Your-Username" }: Props) => {
	const [isOpen, setOpen] = useState(false);

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	return (
		<>
			<Tooltip title="Compose">
				<IconButton onClick={openModal}>
					<HistoryEduOutlinedIcon color="primary" />
				</IconButton>
			</Tooltip>
			<Modal
				open={isOpen}
				onClose={closeModal}
				aria-labelledby="Modal For Posting"
				aria-describedby="Modal that is used for posting on the platform">
				<Paper sx={style} variant="outlined">
					<CardHeader
						title={username}
						avatar={
							<Avatar aria-label="User Icon">{username.charAt(0)}</Avatar>
						}
					/>
					<Box paddingX={2}>
						<Divider />
					</Box>
					<Box padding={2}>
						<TextField
							id="outlined-textarea"
							autoFocus
							fullWidth
							rows={4}
							placeholder="Share A Fitness Byte..."
							multiline
						/>
					</Box>
					<Divider />
					<CardActions>
						<Stack
							flexDirection={"row"}
							justifyContent="space-between"
							width="100%">
							<Stack flexDirection={"row"}>
								<IconButton>
									<ImageOutlinedIcon />
								</IconButton>
								<IconButton>
									<LinkOutlinedIcon />
								</IconButton>
							</Stack>
							<Button variant="contained" color="secondary" type="submit">
								Post
							</Button>
						</Stack>
					</CardActions>
				</Paper>
			</Modal>
		</>
	);
};

export default ComposePost;
