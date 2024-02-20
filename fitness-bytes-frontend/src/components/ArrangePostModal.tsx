import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import {
	Alert,
	Avatar,
	Box,
	Button,
	CardActions,
	CardHeader,
	Divider,
	Paper,
	TextField,
	TextFieldVariants,
	Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Post from "../interfaces/Post";
import ClientService from "../services/ClientService";
import { FormData, MAX_CHAR, schema } from "../services/PostValidatorService";

const style = {
	position: "absolute",
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

interface CardProps {
	username: string;
	textValue: string;
	buttonContent: string;
}

interface ModalProps {
	isOpen: boolean;
	setOpen: (state: boolean) => void;
	ariaLabelledby: string;
	ariaDescribedby: string;
}

interface Props extends CardProps, ModalProps {
	error: string;
	onSubmit: (data: FormData) => void;
}

const ArrangePostModal = ({
	onSubmit,
	setOpen,
	isOpen,
	username,
	error,
	textValue,
	ariaLabelledby,
	ariaDescribedby,
	buttonContent,
}: Props) => {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { isValid, isDirty, errors },
	} = useForm<FormData>({ resolver: zodResolver(schema), mode: "all" });

	const [value, setValue] = useState(textValue);

	const handleChange = (e) => {
		e.preventDefault();
		setValue(e.target.value);
	};

	const closeModal = () => setOpen(false);

	const content = watch("content", "");

	return (
		<Modal
			open={isOpen}
			onClose={closeModal}
			aria-labelledby={ariaLabelledby}
			aria-describedby={ariaDescribedby}>
			<Paper sx={style} variant="outlined">
				<form
					onSubmit={handleSubmit((data) => {
						onSubmit(data);
						reset();
					})}>
					<CardHeader
						title={username}
						avatar={
							<Avatar aria-label="User Icon">{username.charAt(0)}</Avatar>
						}
					/>
					<Box paddingX={2}>
						<Divider />
					</Box>
					{error && <Alert color="error">{error}</Alert>}
					{isDirty && errors.content && (
						<Alert color="error">{errors.content.message}</Alert>
					)}
					<Box padding={2}>
						<TextField
							id="content"
							autoFocus
							fullWidth
							rows={4}
							{...register("content", {
								required: true,
								onChange: handleChange,
							})}
							placeholder="Share A Fitness Byte..."
							value={value}
							multiline
						/>
					</Box>
					{isValid && (
						<Typography>{MAX_CHAR - content.length} characters left</Typography>
					)}
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
								{buttonContent}
							</Button>
						</Stack>
					</CardActions>
				</form>
			</Paper>
		</Modal>
	);
};

export default ArrangePostModal;
