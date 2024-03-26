import Stack from "@mui/material/Stack";
import PageSpinner from "../components/PageSpinner";
import PostCard from "../components/PostCard";
import usePosts from "../hooks/usePosts";
import { IPost } from "../services/PostServices";

const Feed = () => {
	const { data, isLoading } = usePosts();

	const posts: IPost[] = data || [];

	if (isLoading) return <PageSpinner />;

	console.log(posts);

	return (
		<Stack
			boxSizing={"border-box"}
			width={"100%"}
			padding={2}
			maxWidth={"700px"}
			margin={"auto"}
			paddingX={"5rem"}
			alignItems={"center"}>
			<div id="top"></div>
			{posts.map((p) => (
				<PostCard key={p._id} {...p} />
			))}
		</Stack>
	);
};

export default Feed;
