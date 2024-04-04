import { useInfiniteQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";

const PAGE_LENGTH = 5;

const usePosts = (username: string = "") => {
    return useInfiniteQuery({
        queryKey: ['posts', username],
        queryFn: ({ pageParam = 0 }) => PostServices.getAll(username, pageParam, PAGE_LENGTH),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return 0;
            return (lastPage?.length || 0) >= PAGE_LENGTH ?  allPages.length + 1 : undefined;
        },
    });
};


export default usePosts;