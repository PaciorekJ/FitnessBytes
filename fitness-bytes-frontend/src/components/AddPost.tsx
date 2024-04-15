/* eslint-disable no-mixed-spaces-and-tabs */
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useBannerStore from "../hooks/useBannerStore";
import useUser from "../hooks/useUser";
import useUserStore from "../hooks/useUserStore";
import PostServices, {
	IPaginatedPosts,
	IPostImage,
} from "../services/PostServices";
import { PostData } from "../services/Validators/PostValidatorService";
import PostModal from "./PostModal";

export interface IImage {
	base64Array: string;
	type: string;
	imageUrl: string;
}

const AddPost = () => {
	const username = useUserStore((s) => s.username);
	const { data: user } = useUser(username);
	const queryClient = useQueryClient();
	const navigator = useNavigate();
	const [isOpen, setOpen] = useState(false);
	const [error, setError] = useState("");
	const [image, setImage] = useState<IImage>({} as IImage);
	const setBanner = useBannerStore((s) => s.setBanner);

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

		let res: IPostImage | undefined;

		if (image && image.base64Array && image.type) {
			res = await PostServices.addImage(
				post._id,
				image.base64Array,
				image.type,
			);

			if (!res) {
				setBanner("Image may be too large, or not a supported type", true);
			}
		}

		queryClient.setQueryData(
			["posts", ""],
			(
				oldPosts:
					| InfiniteData<IPaginatedPosts | undefined, unknown>
					| undefined,
			) => {
				if (!oldPosts || !oldPosts.pages) {
					return {
						pageParams: [],
						pages: [],
					};
				}

				const newPost = {
					...post,
					profilePicture: user?.profilePicture,
					profilePictureType: user?.profilePictureType,
					imageId: res?._id,
				};

				const updatedPages = oldPosts.pages.map((page, index) =>
					index === 0
						? {
								...page,
								posts: [newPost, ...(page?.posts || [])],
						  }
						: page,
				);

				return {
					...oldPosts,
					pages: updatedPages,
				};
			},
		);

		closeModal();
		setError("");

		setImage({} as IImage);

		navigator(`/auth/feed/`);
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
				image={image}
				setImage={setImage}
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
