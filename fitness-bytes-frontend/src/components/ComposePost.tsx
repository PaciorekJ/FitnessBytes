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
import PostModal from "./PostModal";

const ComposePost = () => {
	const queryClient = useQueryClient();
	const navigator = useNavigate();

	const [isOpen, setOpen] = useState(false);
	const [error, setError] = useState("");

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
					closeModal();
				}, 1000);
				return;
			}

			addPost(res.result as Post);

			closeModal();
			setError("");
		} catch {
			setError("Something went Wrong while submitting the Post");
		}
	};

	return (
		<>
			<Tooltip title="Compose">
				<IconButton onClick={openModal}>
					<HistoryEduOutlinedIcon color="primary" />
				</IconButton>
			</Tooltip>
			<PostModal
				onSubmit={submitPost}
				username={username}
				buttonContent="Post"
				ariaDescribedby="Modal that is used for posting on the platform"
				ariaLabelledby="Modal For Posting"
				isOpen={isOpen}
				setOpen={setOpen}
				error={error}
				textValue={""}
			/>
		</>
	);
};

export default ComposePost;
