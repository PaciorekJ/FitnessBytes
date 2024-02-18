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
import Post from "../interfaces/Post";

import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ReportIcon from "@mui/icons-material/Report";
import ShareIcon from "@mui/icons-material/Share";

import LikeIcon from "./LikeIcon";
import MoreOptions from "./MoreOptions";
import { useQueryClient } from "@tanstack/react-query";
import ClientService, { ResponseResult } from "../services/ClientService";
import Report from "../interfaces/Report";

interface Props {
	post: Post;
}

const PostCard = ({ post }: Props) => {
	const userUsername = localStorage.getItem("username");

	const queryClient = useQueryClient();

	const handleDelete = async () => {
		const client = new ClientService<boolean>(`/post/${post._id}`);

		const { result } = await client.delete();

		if (!result) {
			console.log("Failed to delete");
			return;
		}

		queryClient.setQueryData<ResponseResult<Post[]>>(["posts"], (oldData) => {
			if (!oldData || !Array.isArray(oldData.result)) return oldData;

			const updatedPosts = oldData.result.filter((c) => c._id !== post._id);

			queryClient.invalidateQueries({
				queryKey: [`userPostCount-${post.username}`],
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
			ownerUsername: post.username,
			postId: post._id,
			userId: userId,
		};

		await client.post(report);
	};

	const handleShare = async () => {
		const copyToClipboard = (text: string) => {
			navigator.clipboard.writeText(text).then(
				() => console.log("Content copied to clipboard"),
				(err) => console.error("Could not copy text:", err),
			);
		};

		if (!navigator.share) {
			// Assuming `url` is what you want to copy and prompt the user to share
			copyToClipboard(`http://localhost:5301/post/${post._id}`);
			alert(
				"URL copied to clipboard. Please paste it where you want to share it.",
			);
		} else {
			try {
				await navigator.share({
					title: `Post by ${post.username}`, // Title of the thing you want to share.
					text: post.content, // Text to accompany the thing you're sharing.
					url: `http://localhost/post/${post._id}`, // URL or resource to share.
				});
				console.log("Content shared successfully");
			} catch (error) {
				console.error("Error sharing content:", error);
			}
		}
	};

	const { _id, content, username, likes, timeCreated } = post;

	const time = new Date(timeCreated || "").toString();

	const MoreOptionsMenuItems = [
		{
			component: <DeleteIcon />,
			text: "Delete",
			onClick: handleDelete,
			requireOwnership: true,
		},
		{
			component: <EditIcon />,
			text: "Edit",
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
				<Link href={"/auth/account/" + username} underline="none">
					<CardHeader
						title={username}
						avatar={
							<Avatar aria-label="User Icon">{username.charAt(0)}</Avatar>
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
							isOwner={username === userUsername}
							menuItems={MoreOptionsMenuItems}
						/>
					</Stack>
				</CardActions>
			</Paper>
		</Box>
	);
};

export default PostCard;
