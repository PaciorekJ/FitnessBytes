import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton, Typography } from "@mui/material";
import { useState } from "react";

const LikeIcon = ({ likes }: { likes: number }) => {
	const [isLiked, setLiked] = useState(false);

	const handleToggleLike = () => {
		setLiked(!isLiked);
	};

	return (
		<IconButton onClick={handleToggleLike} aria-label="like this post">
			<FavoriteIcon color={isLiked ? "error" : ""} />
			<Typography variant="body2">{isLiked ? likes + 1 : likes}</Typography>
		</IconButton>
	);
};

export default LikeIcon;
