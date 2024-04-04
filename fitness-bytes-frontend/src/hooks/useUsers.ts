
import { useInfiniteQuery } from "@tanstack/react-query";
import UserServices from "../services/UserServices";

const PAGE_LENGTH = 5;

const useUser = (query: string, excludeFriends: boolean = false) => {
    return useInfiniteQuery({
        queryKey: [`userSearch`, query, excludeFriends],
        queryFn: ({pageParam = 0}) => UserServices.search(query, excludeFriends, pageParam, PAGE_LENGTH),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return 0;
            return (lastPage?.length || 0) >= PAGE_LENGTH ?  allPages.length + 1 : undefined;
        },
        enabled: !!query,
    });
}

export default useUser;