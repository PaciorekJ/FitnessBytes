import FavoriteIcon from "@mui/icons-material/Favorite";
import { CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useIsLiked from "../hooks/useIsLiked";
import PostServices from "../services/PostServices";

interface Props {
	likes: number;
	postId: string;
}

const LikeIcon = ({ likes, postId }: Props) => {
	const { data, isLoading } = useIsLiked(postId);
	const [processingLike, setProcessingLike] = useState(false);
	const [likeCount, setLikeCount] = useState(likes);
	const [isLiked, setLiked] = useState<boolean>(data || false);

	useEffect(() => {
		if (data !== undefined) {
			setLiked(data);
		}
	}, [data]);

	const handleToggleLike = async () => {
		if (processingLike) {
			return;
		}
		setProcessingLike(true);

		// Optimistically update UI
		setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
		setLiked(!isLiked);

		try {
			await PostServices.like(postId);
		} catch (error) {
			setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
			setLiked(isLiked);
		} finally {
			setProcessingLike(false);
		}
	};

	if (isLoading || processingLike)
		return (
			<Stack paddingX={1.5} justifyContent={"center"} alignItems={"center"}>
				<CircularProgress size={"1rem"} />
			</Stack>
		);

	return (
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
	);
};

export default LikeIcon;
