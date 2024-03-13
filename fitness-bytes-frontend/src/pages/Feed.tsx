import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import PostCard from "../components/PostCard";
import usePosts from "../hooks/usePosts";
import { IPost } from "../services/PostServices";

const Feed = () => {
	const { data, isLoading } = usePosts();

	const posts: IPost[] = data || [];

	return (
		<Stack
			boxSizing={"border-box"}
			width={"100%"}
			paddingX={"5rem"}
			alignItems={"center"}>
			<div id="top"></div>
			{posts.map((p) => (
				<PostCard key={p._id} {...p} />
			))}
			{isLoading && (
				<CircularProgress
					sx={{ marginTop: "10%" }}
					size={"5%"}
					color="secondary"
				/>
			)}
		</Stack>
	);
};

export default Feed;
