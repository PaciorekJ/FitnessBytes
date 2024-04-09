import CloseIcon from "@mui/icons-material/Close";
import { Button, Divider, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import useReplyCount from "../hooks/useReplyCount";
import Replies from "./Replies";

interface RepliesProps {
	postId?: string;
	replyId?: string;
}

const RepliesButton = ({ postId, replyId }: RepliesProps) => {
	const { data: count, isLoading } = useReplyCount({ postId, replyId });
	const [open, setOpen] = useState(false);

	if (count === 0) return null;
	if (isLoading) return null;

	return (
		<Stack padding={1}>
			{open && (
				<>
					<IconButton sx={{ alignSelf: "end" }} onClick={() => setOpen(!open)}>
						<CloseIcon />
					</IconButton>
					<Replies postId={postId} replyId={replyId} />
				</>
			)}
			{!open && (
				<Divider variant="middle" textAlign="center">
					<Button
						variant="outlined"
						onClick={() => setOpen(!open)}
						sx={{ textDecoration: "none", color: "secondary.light" }}>
						Replies {count}
					</Button>
				</Divider>
			)}
		</Stack>
	);
};

export default RepliesButton;
