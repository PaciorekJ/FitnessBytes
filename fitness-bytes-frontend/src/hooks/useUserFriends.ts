

import { useInfiniteQuery } from "@tanstack/react-query";
import FriendServices from "../services/FriendServices";

const PAGE_LENGTH = 5;

const useUserFriends = (query: string) => {
    return useInfiniteQuery({
        queryKey: [`userFriendsSearch`, query],
        queryFn: ({pageParam = 0}) => FriendServices.search(query, pageParam, PAGE_LENGTH),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return 0;
            return (lastPage?.length || 0) >= PAGE_LENGTH ?  allPages.length + 1 : undefined;
        },
        enabled: !!query,
    });
}

export default useUserFriends;