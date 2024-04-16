import CancelIcon from "@mui/icons-material/Cancel";
import { Button, Divider, IconButton, Stack, useTheme } from "@mui/material";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useReplies from "../hooks/useReplies";
import useReplyCount from "../hooks/useReplyCount";
import useThemeStore from "../hooks/useThemeStore";
import { IReplyNode } from "../services/ReplyServices";
import PageSpinner from "./PageSpinner";
import Reply from "./Reply";

const RepliesButton = ({ rootId, parentId }: IReplyNode) => {
	const { data: repliesCount, isLoading: countIsLoading } = useReplyCount({
		rootId,
		parentId,
	});
	const {
		data: replies,
		isLoading: repliesIsLoading,
		hasNextPage,
		fetchNextPage,
	} = useReplies({
		rootId,
		parentId,
	});

	const theme = useTheme();
	const mode = useThemeStore((s) => s.mode);
	const [open, setOpen] = useState(false);

	if (countIsLoading) return null;

	const lastPage = replies?.pages?.[replies.pages.length - 1];
	const lastReply = lastPage?.[lastPage.length - 1];

	const key = (lastReply?._id || "undefined") + "-" + repliesCount;

	return (
		<Stack padding={1}>
			{open ? (
				<>
					<IconButton sx={{ alignSelf: "end" }} onClick={() => setOpen(!open)}>
						<CancelIcon />
					</IconButton>
					{repliesIsLoading ? (
						<PageSpinner />
					) : (
						<Stack
							id="scrollableDiv"
							borderLeft={"2px solid"}
							borderColor={"secondary.light"}
							paddingLeft={{ sx: 0.5, sm: 1 }}
							gap={2}
							sx={{
								maxHeight: "80vh",
								overflowY: "scroll",
								flex: "1 1 auto",
							}}>
							<InfiniteScroll
								hasMore={hasNextPage}
								loader={<PageSpinner />}
								next={fetchNextPage}
								scrollableTarget="scrollableDiv"
								dataLength={
									replies?.pages.reduce(
										(acc, page) => acc + (page?.length || 0),
										0,
									) || 0
								}>
								{replies?.pages.map((p, i) => (
									<React.Fragment key={"Replies " + i + p?.length}>
										{p?.map((r) => (
											<Reply
												key={`${r._id} ${r.content} ${r.parentReplyId} ${r.postId}`}
												{...r}
											/>
										))}
									</React.Fragment>
								))}
							</InfiniteScroll>
						</Stack>
					)}
				</>
			) : repliesCount ? (
				<Divider
					sx={
						mode === "dark"
							? {
									"&.MuiDivider-root": {
										"&::before, &::after": {
											borderTop: `thin solid ${theme.palette.secondary.light}`,
										},
									},
									// eslint-disable-next-line no-mixed-spaces-and-tabs
							  }
							: {}
					}
					variant="middle"
					textAlign="center">
					<Button
						key={key}
						variant="outlined"
						onClick={() => setOpen(!open)}
						sx={{ textDecoration: "none", color: "secondary.light" }}>
						Replies {repliesCount}
					</Button>
				</Divider>
			) : (
				<></>
			)}
		</Stack>
	);
};

export default RepliesButton;
