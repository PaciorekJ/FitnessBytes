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
	Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";

import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { zodResolver } from "@hookform/resolvers/zod";
import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
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

interface ModalProps {
	onSubmit: (data: FormData) => void;
	onClose?: () => void;
	isOpen: boolean;
	setOpen: (state: boolean) => void;
	ariaLabelledby: string;
	ariaDescribedby: string;
}

interface Props extends ModalProps {
	error: string;
	username: string;
	textValue: string;
	buttonContent: string;
}

const PostModal = ({
	onSubmit,
	onClose,
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

	const handleChange = (e: {
		preventDefault: () => void;
		target: { value: SetStateAction<string> };
	}) => {
		e.preventDefault();
		setValue(e.target.value);
	};

	const closeModal = () => setOpen(false);

	const content = watch("content", "");

	return (
		<Modal
			open={isOpen}
			onClose={() => {
				closeModal();
				if (onClose) onClose();
			}}
			aria-labelledby={ariaLabelledby}
			aria-describedby={ariaDescribedby}>
			<Paper sx={style} variant="outlined">
				<form
					onSubmit={handleSubmit((data) => {
						onSubmit(data);
						reset();
					})}
					onReset={() => {
						if (onClose) onClose();
						reset();
						closeModal();
					}}>
					<Stack
						flexDirection={"row"}
						alignItems={"center"}
						justifyContent={"space-between"}>
						<CardHeader
							title={username}
							avatar={
								<Avatar aria-label="User Icon">{username.charAt(0)}</Avatar>
							}
						/>
						<IconButton type="reset">
							<CloseIcon />
						</IconButton>
					</Stack>
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

export default PostModal;
