import Stack from "@mui/material/Stack";
import Post from "../interfaces/Post";
import PostCard from "../components/PostCard";
import posts from "../Data/filler";

const Feed = () => {
	return (
		<Stack width={"100%"} alignItems={"center"}>
			<div id="top"></div>
			{posts.map((p) => (
				<PostCard {...p} />
			))}
		</Stack>
	);
};

export default Feed;
