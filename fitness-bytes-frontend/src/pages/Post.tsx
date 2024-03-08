import { CircularProgress, Stack } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import usePost from "../hooks/usePost";
import { IPost } from "../services/PostServices";

const Post = () => {
	const { postId } = useParams();

	const { data, isLoading } = usePost(postId);

	const navigator = useNavigate();

	const post = data || ({} as IPost);

	if (!post) {
		navigator("/Error");
		return;
	}

	return (
		<Stack width={"100%"} alignItems={"center"}>
			{!isLoading && <PostCard {...post} />}
			{isLoading && <CircularProgress />}
		</Stack>
	);
};

export default Post;
