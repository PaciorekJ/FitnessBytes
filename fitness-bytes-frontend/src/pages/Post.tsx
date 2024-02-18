import { useParams } from "react-router-dom";
import usePost from "../hooks/usePost";
import PostCard from "../components/PostCard";
import { Stack, CircularProgress } from "@mui/material";

const Post = () => {
	const { postId } = useParams();

	const { data, isLoading } = usePost(postId);

	const post = data?.result;

	if (!post) return null;

	return (
		<Stack width={"100%"} alignItems={"center"}>
			{!isLoading && <PostCard post={post} />}
			{isLoading && <CircularProgress />}
		</Stack>
	);
};

export default Post;
