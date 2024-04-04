import Stack from "@mui/material/Stack";
import InfiniteScroll from "react-infinite-scroll-component";
import PageSpinner from "../components/PageSpinner";
import PostCard from "../components/PostCard";
import usePosts from "../hooks/usePosts";

const Feed = () => {
	const { data, isLoading, fetchNextPage, hasNextPage } = usePosts();

	const postsPages = data?.pages || [[]];

	if (isLoading) return <PageSpinner />;

	return (
		<Stack alignItems={"center"} padding={2}>
			<Stack width={"100%"} maxWidth={"700px"}>
				<div id="top"></div>
				<InfiniteScroll
					hasMore={hasNextPage}
					loader={<PageSpinner />}
					next={fetchNextPage}
					dataLength={postsPages?.reduce(
						(acc, page) => acc + (Array.isArray(page) ? page.length : 0),
						0,
					)}>
					{postsPages.map((postsPage, index) => {
						// Ensure postsPage is always an array
						if (!Array.isArray(postsPage)) {
							console.error(
								`Expected postsPage to be an array but got: `,
								postsPage,
							);
							return null; // Return null or an appropriate fallback
						}

						return postsPage.map((p) => (
							<PostCard key={`${p._id}-${index}`} {...p} postQueryKey="" />
						));
					})}
				</InfiniteScroll>
			</Stack>
		</Stack>
	);
};

export default Feed;
