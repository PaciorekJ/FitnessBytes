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
import { useState } from "react";
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

const ComposePost = () => {
	const queryClient = useQueryClient();
	const navigator = useNavigate();

	const username = localStorage.getItem("username") || "";

	const addPost = (newPost: Post) => {
		navigator(`/auth/feed/${username}`);

		queryClient.setQueryData(
			["posts"],
			(old: { result: Post[] } | undefined) => {
				return { result: [newPost, ...(old?.result ?? [])] };
			},
		);
	};

	const [isOpen, setOpen] = useState(false);
	const [error, setError] = useState("");

	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { isValid, isDirty, errors },
	} = useForm<FormData>({ resolver: zodResolver(schema), mode: "all" });

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const submitPost = async (data: FormData) => {
		const id = localStorage.getItem("_id") || "";
		const username = localStorage.getItem("username") || "";

		const { content } = data;

		try {
			const client = new ClientService("/post");

			const res = await client.post({
				userId: id,
				username: username,
				content: content,
			});

			if (_.isEmpty(res.result)) {
				setError("Your post can not be posted at this time!");
				setTimeout(() => {
					reset();
					closeModal();
				}, 1000);
				return;
			}

			addPost(res.result as Post);

			reset();
			closeModal();

			setError("");
		} catch {
			setError("Something went Wrong while submitting the Post");
		}
	};

	const content = watch("content", "");

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
					<form onSubmit={handleSubmit((data) => submitPost(data))}>
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
								{...register("content", { required: true })}
								placeholder="Share A Fitness Byte..."
								multiline
							/>
						</Box>
						{isValid && (
							<Typography>
								{MAX_CHAR - content.length} characters left
							</Typography>
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
									Post
								</Button>
							</Stack>
						</CardActions>
					</form>
				</Paper>
			</Modal>
		</>
	);
};

export default ComposePost;
