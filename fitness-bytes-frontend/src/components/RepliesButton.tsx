import CancelIcon from "@mui/icons-material/Cancel";
import { Button, Divider, IconButton, Stack, useTheme } from "@mui/material";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import useReplies from "../hooks/useReplies";
import useReplyCount from "../hooks/useReplyCount";
import useThemeStore from "../hooks/useThemeStore";
import { IReplyNode } from "../services/ReplyServices";
import PageSpinner from "./PageSpinner";
import Reply from "./Reply";

const RepliesButton = ({ rootId, parentId }: IReplyNode) => {
	const { data: count, isLoading: countIsLoading } = useReplyCount({
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
								height: "80vh",
								maxHeight: "100%",
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
								{replies?.pages.map((p) =>
									p?.map((r) => (
										<Reply
											key={`${r._id} ${r.content} ${r.parentReplyId}`}
											{...r}
										/>
									)),
								)}
							</InfiniteScroll>
						</Stack>
					)}
				</>
			) : count ? (
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
						variant="outlined"
						onClick={() => setOpen(!open)}
						sx={{ textDecoration: "none", color: "secondary.light" }}>
						Replies {count}
					</Button>
				</Divider>
			) : (
				<></>
			)}
		</Stack>
	);
};

export default RepliesButton;
