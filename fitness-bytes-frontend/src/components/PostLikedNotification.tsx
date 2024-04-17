import { Stack, Typography } from "@mui/material";
import usePost from "../hooks/usePost";
import { INotification } from "../services/NotificationServices";
import Notification from "./Notification";
import PostCard from "./PostCard";
import ProfilePicture from "./ProfilePicture";

interface PostLikedNotificationProps extends INotification {
	postId: string;
}

const PostLikedNotification = ({
	type,
	_id,
	postId,
	dispatcherUsername,
	timeCreated,
}: PostLikedNotificationProps) => {
	const { data: post, isLoading } = usePost(postId);

	if (isLoading) return null;

	return (
		<Notification
			type={type}
			_id={_id}
			actions
			icon={<ProfilePicture username={dispatcherUsername} />}
			content={
				<Stack width={"100%"}>
					<Typography>
						<Typography
							component="a"
							href={`/auth/account/${dispatcherUsername}#top`}
							sx={{ textDecoration: "none" }}
							color={"secondary"}>
							{dispatcherUsername}
						</Typography>{" "}
						liked your post!
					</Typography>
					<Stack width={"50vw"} maxWidth={"700px"} margin={"auto"} padding={2}>
						<PostCard {...post!} disabled={true}></PostCard>
					</Stack>
				</Stack>
			}
			timestamp={new Date(timeCreated)}
		/>
	);
};

export type { PostLikedNotificationProps };
export default PostLikedNotification;
