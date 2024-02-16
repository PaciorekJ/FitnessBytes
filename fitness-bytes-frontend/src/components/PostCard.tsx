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

import CommentIcon from "@mui/icons-material/Comment";
import ReplyIcon from "@mui/icons-material/Reply";

import LikeIcon from "./LikeIcon";
import MoreOptions from "./MoreOptions";

interface Props {
	post: Post;
}

const PostCard = ({ post }: Props) => {

	const {_id, content, username, likes, timeCreated} = post

	const time = new Date(timeCreated || "").toString();

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
							<IconButton aria-label="Write a comment on this post">
								<CommentIcon />
							</IconButton>
							<IconButton aria-label="write a reply to this post">
								<ReplyIcon />
							</IconButton>
						</Stack>
						<MoreOptions />
					</Stack>
				</CardActions>
			</Paper>
		</Box>
	);
};

export default PostCard;
