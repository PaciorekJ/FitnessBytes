import Stack from "@mui/material/Stack";
import InfiniteScroll from "react-infinite-scroll-component";
import PageSpinner from "../components/PageSpinner";
import PostCard from "../components/PostCard";
import usePosts from "../hooks/usePosts";

const Feed = () => {
	const { data, isLoading, fetchNextPage, hasNextPage } = usePosts();

	if (isLoading) return <PageSpinner />;

	return (
		<Stack alignItems={"center"} padding={2}>
			<Stack width={"100%"} maxWidth={"800px"}>
				<div id="top"></div>
				<InfiniteScroll
					hasMore={hasNextPage}
					loader={<PageSpinner />}
					next={fetchNextPage}
					dataLength={
						data?.pages.reduce(
							(acc, page) =>
								acc + (!page ? 0 : !page.posts ? 0 : page.posts.length),
							0,
						) || 0
					}>
					{data?.pages.map((postsPage, index) => {
						if (!Array.isArray(postsPage?.posts)) {
							return null;
						}

						return postsPage.posts.map((p) => (
							<PostCard key={`${p._id}-${index}`} {...p} postQueryKey="" />
						));
					})}
				</InfiniteScroll>
			</Stack>
		</Stack>
	);
};

export default Feed;
