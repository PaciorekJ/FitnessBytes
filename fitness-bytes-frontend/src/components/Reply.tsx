import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Stack,
	Typography,
} from "@mui/material";
import useUser from "../hooks/useUser";
import { IReply } from "../services/ReplyServices";
import ParseDateFromNow from "../utils/ParseDate";
import LikeIcon from "./LikeIcon";
import PageSpinner from "./PageSpinner";
import ProfilePicture from "./ProfilePicture";
import RepliesButton from "./RepliesButton";
import ReplyButton from "./ReplyButton";

interface ReplyProps extends IReply {
	disabled?: boolean;
}

const Reply = ({
	userId,
	_id,
	content,
	likes,
	timeCreated,
	disabled = false,
}: ReplyProps) => {
	const { data: user, isLoading } = useUser(userId);

	if (isLoading) return <PageSpinner />;

	const time = ParseDateFromNow(new Date(timeCreated || ""));

	return (
		<Stack>
			<Card>
				<CardHeader
					titleTypographyProps={{ fontSize: "1.2rem" }}
					title={
						<Typography variant="body1" color={"text.secondary"}>
							{user?.username || ""}
						</Typography>
					}
					avatar={<ProfilePicture username={user?.username || ""} />}
					subheader={
						<Typography color={"text.disabled"} variant="body2">
							{time || ""}
						</Typography>
					}
				/>
				<CardContent>
					<Typography variant="body2" color="text.secondary">
						{content}
					</Typography>
				</CardContent>
				<CardActions>
					<LikeIcon postId={_id} likes={likes || 0} />
					{!disabled && <ReplyButton postId={_id} />}
				</CardActions>
			</Card>
			{!disabled && <RepliesButton replyId={_id} />}
		</Stack>
	);
};

export default Reply;
