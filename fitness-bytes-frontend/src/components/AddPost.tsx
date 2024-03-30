import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useBannerStore from "../hooks/useBannerStore";
import useUser from "../hooks/useUser";
import useUserStore from "../hooks/useUserStore";
import PostServices, { IPost } from "../services/PostServices";
import { IUser } from "../services/UserServices";
import { PostData } from "../services/Validators/PostValidatorService";
import { compressImage, encodeImage } from "../utils/ImageProcessing";
import PostModal from "./PostModal";

const AddPost = () => {
	const username = useUserStore((s) => s.username);
	const { data: user } = useUser(username);
	const queryClient = useQueryClient();
	const navigator = useNavigate();
	const [isOpen, setOpen] = useState(false);
	const [error, setError] = useState("");
	const setBanner = useBannerStore((s) => s.setBanner);

	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			setBanner("Error: A invalid image, or no image was selected!", true);
			return;
		}

		const file = e.target.files[0];

		try {
			const compressedImage = await compressImage(file);
			const base64Array = await encodeImage(compressedImage);
			const res = await PostServices.addImage(
				base64Array,
				compressedImage.type,
			);
			if (!res)
				throw new Error("Image may be too large, or not a supported type");

			setBanner("Successfully set Profile Picture");
		} catch (error) {
			setBanner(`${error}`, true);
		}
	};

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
				imageId: "",
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
