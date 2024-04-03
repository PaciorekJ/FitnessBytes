import Stack from "@mui/material/Stack";
import InfiniteScroll from "react-infinite-scroll-component";
import PageSpinner from "../components/PageSpinner";
import PostCard from "../components/PostCard";
import usePosts from "../hooks/usePosts";

const Feed = () => {
	const { data, isLoading, fetchNextPage, hasNextPage } = usePosts();

	const postsPages = data?.pages || [];

	if (isLoading) return <PageSpinner />;

	return (
		<Stack
			boxSizing={"border-box"}
			width={"100%"}
			padding={2}
			maxWidth={"700px"}
			margin={"auto"}
			paddingX={{ xs: 0, md: "5rem" }}
			alignItems={"center"}>
			<div id="top"></div>
			<InfiniteScroll
				hasMore={hasNextPage}
				loader={<PageSpinner />}
				next={fetchNextPage}
				dataLength={postsPages?.length || 0}>
				{postsPages.map((postsPage) =>
					postsPage?.map((p) => <PostCard key={p._id} {...p} postQueryKey="" />),
				)}
			</InfiniteScroll>
		</Stack>
	);
};

export default Feed;
