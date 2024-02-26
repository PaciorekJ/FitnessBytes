import FavoriteIcon from "@mui/icons-material/Favorite";
import { CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useIsLiked from "../hooks/useIsLiked";
import useUserStore from "../hooks/useUserStore";
import ClientService from "../services/ClientService";

interface Props {
	likes: number;
	postId: string;
}

const LikeIcon = ({ likes, postId }: Props) => {
	const userId = useUserStore((s) => s._id);

	const { data, isLoading } = useIsLiked(postId);
	const [likeCount, setLikeCount] = useState(likes);

	const { result } = data || {};
	const [isLiked, setLiked] = useState<boolean>(result || false);

	useEffect(() => {
		if (result !== undefined) {
			setLiked(result);
		}
	}, [result]);

	if (isLoading) return <CircularProgress />;

	const handleToggleLike = async () => {
		const client = new ClientService<boolean>("/post/like");

		const json = {
			userId: userId,
			postId: postId,
		};

		const { result } = await client.post(json);

		setLikeCount(result ? likeCount + 1 : likeCount - 1);

		setLiked(!isLiked);
	};

	return (
		<>
			<Stack flexDirection={"row"} alignItems={"center"}>
				<IconButton
					onClick={handleToggleLike}
					sx={{ padding: "0" }}
					aria-label="like this post">
					<FavoriteIcon
						sx={{
							color: isLiked ? "error.main" : "inherit",
						}}
					/>
				</IconButton>
				<Typography
					sx={{
						paddingLeft: 1,
						color: "text.secondary",
					}}
					variant="body2">
					{likeCount}
				</Typography>
			</Stack>
		</>
	);
};

export default LikeIcon;
