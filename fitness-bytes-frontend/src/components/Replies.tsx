import { Stack } from "@mui/material";
import useReplies from "../hooks/useReplies";
import PageSpinner from "./PageSpinner";
import Reply from "./Reply";

interface RepliesProps {
	postId?: string;
	replyId?: string;
}

const Replies = ({ postId, replyId }: RepliesProps) => {
	const { data, isLoading } = useReplies({ postId, replyId });

	if (isLoading) return <PageSpinner />;

	if (!data) return null;

	return (
		<Stack gap={2}>
			{data.map((r) => (
				<Reply {...r} />
			))}
		</Stack>
	);
};

export default Replies;
