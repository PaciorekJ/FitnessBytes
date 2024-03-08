import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import PostCard from "../components/PostCard";
import usePosts from "../hooks/usePosts";
import { IPost } from "../services/PostServices";

const Feed = () => {
	const { data, isLoading } = usePosts();

	const posts: IPost[] = data || [];

	return (
		<Stack width={"100%"} alignItems={"center"}>
			<div id="top"></div>
			{!isLoading && posts.map((p) => <PostCard key={p._id} {...p} />)}
			{isLoading && <CircularProgress />}
		</Stack>
	);
};

export default Feed;
