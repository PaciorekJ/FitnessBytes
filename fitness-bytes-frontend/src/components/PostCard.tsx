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
import CommentIcon from "@mui/icons-material/Comment";
import ShareIcon from "@mui/icons-material/Share";
import LikeIcon from "./LikeIcon";
import MoreOptions from "./MoreOptions";
import AddReactionIcon from "@mui/icons-material/AddReaction";

const PostCard = ({ content, username, likes, timeCreated }: Post) => {
	return (
		<Box padding={1}>
			<Paper variant="outlined">
				<Link href={"/auth/account/" + username} underline="none">
					<CardHeader
						title={username}
						avatar={
							<Avatar aria-label="User Icon">{username.charAt(0)}</Avatar>
						}
						subheader={timeCreated?.toDateString() || ""}
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
							<LikeIcon likes={likes || 0} />
							<IconButton aria-label="Add a reaction to this post">
								<AddReactionIcon />
							</IconButton>
							<IconButton aria-label="Write a comment on this post">
								<CommentIcon />
							</IconButton>
							<IconButton aria-label="write a reply to this post">
								<ReplyIcon />
							</IconButton>
							<IconButton aria-label="share this post">
								<ShareIcon />
							</IconButton>
						</Stack>
						<IconButton aria-label="more option for this post">
							<MoreOptions />
						</IconButton>
					</Stack>
				</CardActions>
			</Paper>
		</Box>
	);
};

export default PostCard;
