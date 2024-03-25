import {
	Avatar,
	Box,
	CardActions,
	CardContent,
	CardHeader,
	Divider,
	IconButton,
	Link,
	Paper,
	Stack,
	Typography,
} from "@mui/material";

import { memo, useCallback, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import ReportIcon from "@mui/icons-material/Report";
import ShareIcon from "@mui/icons-material/Share";

import { useQueryClient } from "@tanstack/react-query";
import useBannerStore from "../hooks/useBannerStore";
import useUserStore from "../hooks/useUserStore";
import PostServices, { IPost } from "../services/PostServices";
import ReportServices from "../services/ReportServices";
import ParseDateFromNow from "../utils/ParseDate";
import LikeIcon from "./LikeIcon";
import MoreOptions from "./MoreOptions";
import PostModal from "./PostModal";

const PostCard = memo(
	({ _id, content, username: postUsername, likes, timeCreated }: IPost) => {
		const queryClient = useQueryClient();
		const currentUserUsername = useUserStore((s) => s.username);
		const [isOpen, setOpen] = useState(false);
		const [error, setError] = useState("");

		const setBanner = useBannerStore((s) => s.setBanner);

		const time = ParseDateFromNow(new Date(timeCreated || ""));

		const handleDelete = useCallback(async () => {
			const res = await PostServices.delete(_id);

			if (!res) {
				setError("Error: Failed to delete post, please try again!");
				setBanner("Error: Failed to delete post, please try again!", true);
				return;
			}

			queryClient.setQueryData<IPost[]>(["posts"], (oldPosts) => {
				queryClient.invalidateQueries({
					queryKey: [`userPostCount-${postUsername}`],
				});

				return oldPosts?.filter((post) => post._id !== _id) || [];
			});
		}, [_id, postUsername, queryClient]);

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

		const submitPostUpdate = useCallback(
			async (data: { content: string }) => {
				const res = await PostServices.update({
					_id,
					content: data.content,
				});

				if (!res) {
					setError("Error: Failed to update post, please try again!");
					setBanner("Error: Failed to update post, please try again!", true);
					return;
				}

				queryClient.setQueryData(["posts"], (oldPosts: IPost[] | undefined) => {
					return (
						oldPosts?.map((p) => {
							if (p._id === _id) {
								return {
									...p,
									content: data.content,
								};
							}
							return p;
						}) || []
					);
				});

				setOpen(false);
			},
			[_id, queryClient],
		);

		const MoreOptionsMenuItems = [
			{
				component: <DeleteIcon />,
				text: "Delete",
				onClick: handleDelete,
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
					/>
				),
				text: "Edit",
				onClick: () => setOpen(true),
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
					<Link href={"/auth/account/" + postUsername} underline="none">
						<CardHeader
							titleTypographyProps={{ fontSize: "1.2rem" }}
							title={
								<Typography variant="body1" color={"text.secondary"}>
									{postUsername}
								</Typography>
							}
							avatar={
								<Avatar aria-label="User Icon">{postUsername.charAt(0)}</Avatar>
							}
							subheader={
								<Typography color={"text.disabled"} variant="body2">
									{time || ""}
								</Typography>
							}
						/>
					</Link>
					<Box paddingX={2}>
						<Divider />
					</Box>
					<Box padding={2}>
						<CardContent>
							<Typography variant="body2" color="text.secondary">
								{content}
							</Typography>
						</CardContent>
					</Box>
					<Divider />
					<CardActions>
						<Stack
							sx={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "100%",
							}}>
							<Stack flexDirection={"row"}>
								<LikeIcon postId={_id} likes={likes || 0} />
								<IconButton aria-label="write a reply to this post">
									<ReplyIcon />
								</IconButton>
							</Stack>
							<MoreOptions
								isOwner={postUsername === currentUserUsername}
								menuItems={MoreOptionsMenuItems}
							/>
						</Stack>
					</CardActions>
				</Paper>
			</Box>
		);
	},
);

export default PostCard;
