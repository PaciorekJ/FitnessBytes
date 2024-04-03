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
		<Stack alignItems={"center"} padding={2}>
			<Stack width={"100%"} maxWidth={"700px"}>
				<div id="top"></div>
				<InfiniteScroll
					hasMore={hasNextPage}
					loader={<PageSpinner />}
					next={fetchNextPage}
					dataLength={postsPages?.length || 0}>
					{postsPages.map((postsPage) =>
						postsPage?.map((p) => (
							<PostCard key={p._id} {...p} postQueryKey="" />
						)),
					)}
				</InfiniteScroll>
			</Stack>
		</Stack>
	);
};

export default Feed;
