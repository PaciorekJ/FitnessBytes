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
	Typography
} from "@mui/material";
import Post from "../interfaces/Post";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import ReportIcon from "@mui/icons-material/Report";
import ShareIcon from "@mui/icons-material/Share";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Report from "../interfaces/Report";
import ClientService, { ResponseResult } from "../services/ClientService";
import LikeIcon from "./LikeIcon";
import MoreOptions from "./MoreOptions";
import PostModal from "./PostModal";

interface Props {
	post: Post;
}

const PostCard = ({
	post: { _id, content, username: postUsername, likes, timeCreated },
}: Props) => {
	const userUsername = localStorage.getItem("username") || "Error";

	const time = new Date(timeCreated || "").toString();
	const queryClient = useQueryClient();
	const [isOpen, setOpen] = useState(false);
	const [error, setError] = useState("");

	const handleDelete = async () => {
		const client = new ClientService<boolean>(`/post/${_id}`);

		const { result } = await client.delete();

		if (!result) {
			console.log("Failed to delete");
			return;
		}

		queryClient.setQueryData<ResponseResult<Post[]>>(["posts"], (oldData) => {
			if (!oldData || !Array.isArray(oldData.result)) return oldData;

			const updatedPosts = oldData.result.filter((c) => c._id !== _id);

			queryClient.invalidateQueries({
				queryKey: [`userPostCount-${postUsername}`],
			});

			return {
				...oldData,
				result: updatedPosts,
			};
		});
	};

	const handleReport = async () => {
		const client = new ClientService("/report");

		const userId = localStorage.getItem("_id");

		if (!userId) {
			console.error("UserID Invalid");
			return;
		}

		const report: Report = {
			ownerUsername: postUsername,
			postId: _id,
			userId: userId,
		};

		try {
			await client.post(report);
		} catch {
			alert("Something went wrong while trying to report " + postUsername);
			return;
		}

		alert(postUsername + "'s post has been reported!");
	};

	const handleShare = async () => {
		const copyToClipboard = (text: string) => {
			navigator.clipboard.writeText(text).then(
				() => console.log("Content copied to clipboard"),
				(err) => console.error("Could not copy text:", err),
			);
		};

		if (!navigator.share) {
			copyToClipboard(`http://localhost:5301/auth/post/${_id}`);
			alert(
				"URL copied to clipboard. Please paste it where you want to share it.",
			);
		} else {
			try {
				await navigator.share({
					title: `Post by ${postUsername}`, // Title of the thing you want to share.
					text: content, // Text to accompany the thing you're sharing.
					url: `http://localhost:5301/auth/post/${_id}`, // URL or resource to share.
				});
				console.log("Content shared successfully");
			} catch (error) {
				console.error("Error sharing content:", error);
			}
		}
	};

	const submitPostUpdate = async (data: { content: string }) => {
		const client = new ClientService("/post");

		const payload = {
			postId: _id,
			content: data.content,
		};

		try {
			await client.patch(payload);
		} catch {
			setError("Error: Failed to update post, please try again!");
			return;
		}

		queryClient.setQueryData(
			["posts"],
			(old: { result: Post[] } | undefined) => {
				const newPosts = old?.result.map((p) => {
					if (p._id === _id) {
						return {
							...p,
							content: data.content,
						};
					}
					return p;
				});
				return { result: [...(newPosts ?? [])] };
			},
		);

		setOpen(false);
	};

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
					username={userUsername}
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
		<Box padding={1}>
			<Paper variant="outlined">
				<Link href={"/auth/account/" + postUsername} underline="none">
					<CardHeader
						titleTypographyProps={{ fontSize: "1.2rem" }}
						title={postUsername}
						avatar={
							<Avatar aria-label="User Icon">{postUsername.charAt(0)}</Avatar>
						}
						subheader={time || ""}
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
						flexDirection={"row"}
						justifyContent="space-between"
						width="100%">
						<Stack flexDirection={"row"}>
							<LikeIcon postId={_id} likes={likes || 0} />
							<IconButton aria-label="write a reply to this post">
								<ReplyIcon />
							</IconButton>
						</Stack>
						<MoreOptions
							isOwner={postUsername === userUsername}
							menuItems={MoreOptionsMenuItems}
						/>
					</Stack>
				</CardActions>
			</Paper>
		</Box>
	);
};

export default PostCard;
