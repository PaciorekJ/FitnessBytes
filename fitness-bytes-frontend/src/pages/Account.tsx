import {
	Avatar,
	Box,
	CircularProgress,
	Container,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import usePostCount from "../hooks/usePostCount";
import usePosts from "../hooks/usePosts";

const Account = () => {
	const { username } = useParams();

	const { data } = usePosts(username);

	const posts = data || [];

	const { data: postCountData, isLoading: postCountIsLoading } = usePostCount(
		username || "",
	);

	const postCount = postCountData || 0;

	return (
		<Container maxWidth="sm">
			<Box
				sx={{
					my: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				<Avatar
					sizes="xl"
					alt="Avatar"
					sx={{
						width: "20vw",
						height: "20vw",
						maxWidth: "200px",
						maxHeight: "200px",
					}}
				/>
				<Typography variant="h6" component="h1" gutterBottom>
					{username}
				</Typography>
				<Stack flexDirection={"row"} gap={2}>
					<Stack flexDirection={"row"} gap={"5px"}>
						{postCountIsLoading ? (
							<CircularProgress />
						) : (
							<Typography fontWeight={"700"}>{postCount}</Typography>
						)}
						<Typography>Posts</Typography>
					</Stack>
					<Stack flexDirection={"row"} gap={"5px"}></Stack>
				</Stack>
				<Divider orientation="horizontal" variant="fullWidth" />
				<Stack>
					{posts?.map((p) => (
						<PostCard key={p._id} {...p} />
					))}
				</Stack>
			</Box>
		</Container>
	);
};

export default Account;
