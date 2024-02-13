import {
	Avatar,
	Divider,
	Box,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import posts from "../Data/filler";
import PostCard from "../components/PostCard";
import { useParams } from "react-router-dom";

const Account = ({ postNumber = 1, likesNumber = 2 }) => {
	const { username } = useParams();

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
						<Typography fontWeight={"700"}>{postNumber}</Typography>
						<Typography>Posts</Typography>
					</Stack>
					<Stack flexDirection={"row"} gap={"5px"}>
						<Typography fontWeight={"700"}>{likesNumber}</Typography>
						<Typography>Likes</Typography>
					</Stack>
				</Stack>
				<Divider orientation="horizontal" variant="fullWidth" />
				<Stack>
					{posts.map((p) => (
						<PostCard {...p} />
					))}
				</Stack>
			</Box>
		</Container>
	);
};

export default Account;
