import FavoriteIcon from "@mui/icons-material/Favorite";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useIsLiked from "../hooks/useIsLiked";
import ClientService from "../services/ClientService";

interface Props {
	likes: number;
	postId: string;
}

const LikeIcon = ({ likes, postId }: Props) => {
	const { data, isLoading } = useIsLiked(postId);

	const { result } = data || {};

	const [likeCount, setLikeCount] = useState(likes);
	const [isLiked, setLiked] = useState<boolean>(result || false);

	useEffect(() => {
		if (result !== undefined) {
			setLiked(result);
		}
	}, [result]);

	if (isLoading) return <CircularProgress />;

	const userId = localStorage.getItem("_id") || "";

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
		<IconButton onClick={handleToggleLike} aria-label="like this post">
			<FavoriteIcon
				sx={{
					color: isLiked ? "error.main" : "inherit",
				}}
			/>
			<Typography paddingLeft={1} color={"text.secondary"} variant="body2">
				{likeCount}
			</Typography>
		</IconButton>
	);
};

export default LikeIcon;
