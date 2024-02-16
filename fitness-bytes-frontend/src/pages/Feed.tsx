import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import PostCard from "../components/PostCard";
import usePosts from "../hooks/usePosts";
import Post from "../interfaces/Post";

const Feed = () => {
	const { data, isLoading } = usePosts();

	const posts: Post[] = data?.result || [];

	return (
		<Stack width={"100%"} alignItems={"center"}>
			<div id="top"></div>
			{!isLoading && posts.map((p) => <PostCard key={p._id} post={p} />)}
			{isLoading && <CircularProgress />}
		</Stack>
	);
};

export default Feed;
