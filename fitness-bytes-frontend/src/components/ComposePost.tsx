import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "../hooks/useUserStore";
import Post from "../interfaces/Post";
import ClientService from "../services/ClientService";
import { FormData } from "../services/PostValidatorService";
import PostModal from "./PostModal";

const ComposePost = () => {
	const { _id: id, username } = useUserStore((s) => ({
		_id: s._id, username: s.username
	}));
	const queryClient = useQueryClient();
	const navigator = useNavigate();
	const [isOpen, setOpen] = useState(false);
	const [error, setError] = useState("");

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
