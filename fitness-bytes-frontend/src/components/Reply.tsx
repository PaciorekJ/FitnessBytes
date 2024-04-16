import DeleteIcon from "@mui/icons-material/Delete";
import {
	Box,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Link,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import useBannerStore from "../hooks/useBannerStore";
import { LikeId } from "../hooks/useIsLiked";
import useReplies from "../hooks/useReplies";
import useUser from "../hooks/useUser";
import useUserStore from "../hooks/useUserStore";
import ReplyServices, { IReply } from "../services/ReplyServices";
import ParseDateFromNow from "../utils/ParseDate";
import LikeIcon from "./LikeIcon";
import MoreOptions from "./MoreOptions";
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
	postId,
	parentReplyId = null,
	content,
	likes,
	timeCreated,
	disabled = false,
}: ReplyProps) => {
	const { data: user, isLoading } = useUser(userId);
	const { data } = useReplies({
		rootId: postId,
		parentId: _id,
	});
	const username = useUserStore((s) => s.username);
	const setBanner = useBannerStore((s) => s.setBanner);
	const queryClient = useQueryClient();

	const handleDelete = async () => {
		const result = await ReplyServices.delete(_id);

		if (!result) {
			setBanner("Error: Failed to delete reply, please try again!", true);
			return;
		}

		queryClient.setQueryData<InfiniteData<IReply[] | undefined, unknown>>(
			parentReplyId
				? ["repliesByReplyId", parentReplyId]
				: ["repliesByPostId", postId],
			(oldReplies) => {
				if (!oldReplies || !oldReplies.pages) {
					return {
						pages: [],
						pageParams: [],
					};
				}

				const newPages = oldReplies.pages.map((page) =>
					page?.filter((reply) => reply._id !== _id),
				);
				const nonEmptyPages = newPages.filter((page) => page?.length || 0 > 0);

				return {
					...oldReplies,
					pages: nonEmptyPages,
					pageParams: oldReplies.pageParams,
				};
			},
		);

		queryClient.invalidateQueries({
			queryKey: parentReplyId
				? ["replyCountByReply", parentReplyId]
				: ["replyCountByPostId", postId],
		});
	};

	const MoreOptionsMenuItems = [
		{
			component: <DeleteIcon />,
			text: "Delete",
			onClick: disabled ? () => {} : handleDelete,
			requireOwnership: true,
		},
	];

	if (isLoading) return <PageSpinner />;

	const time = ParseDateFromNow(new Date(timeCreated || ""));
	const lastPage = data?.pages?.[data.pages.length - 1];
	const lastReply = lastPage?.[lastPage.length - 1];
	const lastReplyId = lastReply?._id ?? "default-id";

	const repliesCount = data?.pages.reduce(
		(acc, e) => acc + (e?.length || 0),
		0,
	);
	const key = `${lastReplyId}-${repliesCount}-${parentReplyId}-${postId}`;

	return (
		<Box minWidth={"100%"}>
			<Paper variant="outlined">
				<Card>
					<Link href={"/auth/account/" + user?.username} underline="none">
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
					</Link>
					<CardContent sx={{ height: "max-content", textWrap: "wrap" }}>
						<Typography
							sx={{
								textWrap: "wrap",
							}}
							variant="body2"
							color="text.secondary">
							{content}
						</Typography>
					</CardContent>
					<CardActions sx={disabled ? { paddingBottom: 2 } : {}}>
						{!disabled && (
							<Stack
								sx={{
									flexDirection: "row",
									justifyContent: "space-between",
									width: "100%",
								}}>
								<Stack flexDirection={"row"}>
									<LikeIcon id={_id} likes={likes || 0} type={LikeId.replyId} />
									<ReplyButton rootId={postId} parentId={_id} />
								</Stack>
								<MoreOptions
									isOwner={user?.username === username}
									menuItems={MoreOptionsMenuItems}
								/>
							</Stack>
						)}
					</CardActions>
				</Card>
			</Paper>
			{!disabled && <RepliesButton key={key} rootId={postId} parentId={_id} />}
		</Box>
	);
};

export default Reply;
