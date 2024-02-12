import Stack from "@mui/material/Stack";
import Post from "../interfaces/Post";
import PostCard from "../components/PostCard";

const Feed = () => {
	const d = new Date();

	const posts: Post[] = [
		{
			username: "Jason",
			content: "Hello everyone, Today I went for a long run it was great",
			likes: 0,
			timeCreated: d,
		},
		{
			username: "Pauly D",
			content: "Hello everyone, Today I went for a long run it was great",
			likes: 0,
			timeCreated: d,
		},
		{
			username: "Pauly D",
			content: "Hello everyone, Today I went for a long run it was great",
			likes: 0,
			timeCreated: d,
		},
		{
			username: "Pauly D",
			content: "Hello everyone, Today I went for a long run it was great",
			likes: 0,
			timeCreated: d,
		},
		{
			username: "Pauly D",
			content: "Hello everyone, Today I went for a long run it was great",
			likes: 0,
			timeCreated: d,
		},
		{
			username: "Pauly D",
			content: "Hello everyone, Today I went for a long run it was great",
			likes: 0,
			timeCreated: d,
		},
		{
			username: "Pauly D",
			content: "Hello everyone, Today I went for a long run it was great",
			likes: 0,
			timeCreated: d,
		},
	];

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
