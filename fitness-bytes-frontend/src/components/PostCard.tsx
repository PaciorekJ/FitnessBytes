/* eslint-disable no-mixed-spaces-and-tabs */
import {
	Box,
	CardActions,
	CardContent,
	CardHeader,
	CircularProgress,
	Divider,
	Link,
	Paper,
	Stack,
	Typography,
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import ReportIcon from "@mui/icons-material/Report";
import ShareIcon from "@mui/icons-material/Share";

import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import useBannerStore from "../hooks/useBannerStore";
import { LikeId } from "../hooks/useIsLiked";
import usePostImage from "../hooks/usePostImage";
import useUserStore from "../hooks/useUserStore";
import PostServices, {
	IPaginatedPosts,
	IPost,
	IPostImage,
} from "../services/PostServices";
import ReportServices from "../services/ReportServices";
import { PostData } from "../services/Validators/PostValidatorService";
import { decodeImage } from "../utils/ImageProcessing";
import ParseDateFromNow from "../utils/ParseDate";
import { IImage } from "./AddPost";
import LikeIcon from "./LikeIcon";
import MoreOptions from "./MoreOptions";
import PostModal from "./PostModal";
import ProfilePicture from "./ProfilePicture";
import RepliesButton from "./RepliesButton";
import ReplyButton from "./ReplyButton";

interface PostCardProps extends IPost {
	postQueryKey?: string;
	disabled?: boolean;
}

const PostCard = ({
	_id,
	content,
	username: postUsername,
	likes,
	timeCreated,
	imageId = "",
	postQueryKey = "",
	disabled = false,
}: PostCardProps) => {
	const queryClient = useQueryClient();
	const currentUserUsername = useUserStore((s) => s.username);
	const [isOpen, setOpen] = useState(false);
	const [error, setError] = useState("");
	const { data: image, isLoading: imageIsLoading } = usePostImage(
		imageId || "",
	);
	const [imageUrl, setImageUrl] = useState("");
	const [imageForEdit, imageForEditSet] = useState<IImage>({} as IImage);

	useEffect(() => {
		if (!imageId || !image?.image || !image?.imageType || imageIsLoading)
			return;

		const setImage = async () => {
			const blob = decodeImage(image.image, image.imageType);
			const url = URL.createObjectURL(blob);
			imageForEditSet({
				base64Array: image.image,
				type: image.imageType,
				imageUrl: url,
			});
			setImageUrl(url);
		};

		setImage();
	}, [imageId, image, imageIsLoading, imageForEditSet]);

	const setBanner = useBannerStore((s) => s.setBanner);

	const time = ParseDateFromNow(new Date(timeCreated || ""));

	const handleDelete = useCallback(async () => {
		const res = await PostServices.delete(_id);

		if (!res) {
			setError("Error: Failed to delete post, please try again!");
			setBanner("Error: Failed to delete post, please try again!", true);
			return;
		}

		queryClient.setQueryData<
			InfiniteData<IPaginatedPosts | undefined, unknown>
		>(["posts", postQueryKey], (oldPosts) => {
			if (!oldPosts) {
				return {
					pageParams: [],
					pages: [],
				};
			}

			const updatedPages = oldPosts.pages.map((page) => {
				if (!page)
					return {
						hasMore: false,
						posts: [],
					};

				const newPosts = page.posts.filter((post) => post._id !== _id);
				return {
					...page,
					posts: newPosts,
				};
			});

			return {
				...oldPosts,
				pages: updatedPages,
			};
		});
	}, [_id, queryClient, postQueryKey, setBanner]);

	const handleReport = async () => {
		const res = await ReportServices.create({
			ownerUsername: postUsername,
			postId: _id,
		});

		if (!res) {
			setBanner(
				"Something went wrong while trying to report " + postUsername,
				true,
			);
			return;
		}

		setBanner(postUsername + "'s post has been reported!");
	};

	const handleShare = async () => {
		if (!navigator.share) {
			navigator.clipboard.writeText(`http://localhost:5173/auth/post/${_id}`);
			setBanner("URL copied to clipboard");
		} else {
			try {
				await navigator.share({
					title: `Fresh FitnessBytes from ${postUsername}`, // Title of the thing you want to share.
					text: content, // Text to accompany the thing you're sharing.
					url: `http://localhost:5173/auth/post/${_id}`, // URL or resource to share.
				});
			} catch (error) {
				setBanner("Post sharing failed, Please Try again!", true);
			}
		}
	};

	const submitPostUpdate = async (data: PostData) => {
		let CurrentImageId = imageId;
		await PostServices.update({
			_id,
			content: data.content,
		});

		if (imageForEdit) {
			let res: true | IPostImage | undefined = true;
			try {
				if (imageId) {
					res = await PostServices.updateImage(
						imageId,
						imageForEdit.base64Array,
						imageForEdit.type,
					);

					queryClient.setQueryData(
						[`postImage-${imageId}`, imageId],
						(oldImage: IPostImage | undefined) => {
							return {
								...oldImage,
								image: imageForEdit.base64Array,
								imageType: imageForEdit.type,
							};
						},
					);
				} else {
					res = await PostServices.addImage(
						_id,
						imageForEdit.base64Array,
						imageForEdit.type,
					);
					CurrentImageId = res?._id || "";
				}
			} catch {
				if (!res) {
					setBanner("Failed to update Post Image", true);
					return;
				}
			}
		}

		queryClient.setQueryData<
			InfiniteData<IPaginatedPosts | undefined, unknown> | undefined
		>(["posts", postQueryKey], (oldPosts) => {
			if (!oldPosts) {
				return undefined;
			}

			const updatedPages = oldPosts.pages
				.map((page) => {
					if (!page) {
						return undefined;
					}

					return {
						...page,
						posts: page.posts.map((post) =>
							post._id === _id
								? {
										...post,
										content: data.content,
										imageId: CurrentImageId,
								  }
								: post,
						),
					};
				})
				.filter((page) => page !== undefined);

			return {
				pages: updatedPages,
				pageParams: oldPosts.pageParams || [],
			};
		});

		setOpen(false);
	};

	const MoreOptionsMenuItems = [
		{
			component: <DeleteIcon />,
			text: "Delete",
			onClick: disabled ? () => {} : handleDelete,
			requireOwnership: true,
		},
		{
			component: <EditIcon />,
			modal: (
				<PostModal
					onSubmit={submitPostUpdate}
					username={currentUserUsername}
					isOpen={isOpen}
					ariaDescribedby="Modal that is used for editing a post on the platform"
					ariaLabelledby="Modal For editing a post"
					buttonContent="Done"
					setOpen={setOpen}
					error={error}
					textValue={content}
					setImage={imageForEditSet}
					image={imageForEdit}
				/>
			),
			text: "Edit",
			onClick: disabled ? () => {} : () => setOpen(true),
			requireOwnership: true,
		},
		{
			component: <ShareIcon />,
			text: "Share",
			onClick: handleShare,
			requireOwnership: false,
		},
		{
			component: <ReportIcon />,
			text: "Report",
			onClick: handleReport,
			requireOwnership: false,
		},
	];

	return (
		<Box padding={1} minWidth={"100%"}>
			<Paper variant="outlined">
				<Stack flexDirection={"row"} justifyContent={"space-between"}>
					<Link href={"/auth/account/" + postUsername} underline="none">
						<CardHeader
							titleTypographyProps={{ fontSize: "1.2rem" }}
							title={
								<Typography variant="body1" color={"text.secondary"}>
									{postUsername}
								</Typography>
							}
							avatar={<ProfilePicture username={postUsername} />}
							subheader={
								<Typography color={"text.disabled"} variant="body2">
									{time || ""}
								</Typography>
							}
						/>
					</Link>
				</Stack>
				<Box paddingX={2}>
					<Divider />
				</Box>
				<Box padding={2}>
					<CardContent>
						<Stack alignItems={"center"} marginBlockEnd={2}>
							{imageId &&
								((imageUrl && <img src={imageUrl} alt="" />) ||
									(imageIsLoading && <CircularProgress />))}
						</Stack>
						<Typography variant="body2" color="text.secondary">
							{content}
						</Typography>
					</CardContent>
				</Box>
				<Divider />
				<CardActions sx={disabled ? { paddingBottom: 4 } : {}}>
					{!disabled && (
						<Stack
							sx={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "100%",
							}}>
							<Stack flexDirection={"row"}>
								<LikeIcon id={_id} likes={likes || 0} type={LikeId.postId} />
								<ReplyButton rootId={_id} parentId={null} />
							</Stack>
							<MoreOptions
								isOwner={postUsername === currentUserUsername}
								menuItems={MoreOptionsMenuItems}
							/>
						</Stack>
					)}
				</CardActions>
			</Paper>
			{!disabled && <RepliesButton rootId={_id} parentId={null} />}
		</Box>
	);
};

export default PostCard;
