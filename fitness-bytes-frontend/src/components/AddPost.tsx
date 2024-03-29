import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";
import useUserStore from "../hooks/useUserStore";
import PostServices, { IPost } from "../services/PostServices";
import { PostData } from "../services/Validators/PostValidatorService";
import PostModal from "./PostModal";

const AddPost = () => {
	const username = useUserStore((s) => s.username);
	const { data: user } = useUser(username);
	const queryClient = useQueryClient();
	const navigator = useNavigate();
	const [isOpen, setOpen] = useState(false);
	const [error, setError] = useState("");

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const submitPost = async (data: PostData) => {
		const post = await PostServices.create({
			content: data.content,
		});

		if (!post) {
			setError("Your post can not be posted at this time!");
			setTimeout(() => {
				closeModal();
			}, 1000);
			return;
		}

		navigator(`/auth/feed/`);

		queryClient.setQueryData(["posts", ""], (oldPosts: IPost[] | undefined) => [
			{
				...post,
				profilePicture: user?.profilePicture,
				profilePictureType: user?.profilePictureType,
			},
			...(oldPosts || []),
		]);

		closeModal();
		setError("");
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
				resetOnSubmit
				textValue={""}
			/>
		</>
	);
};

export default AddPost;
