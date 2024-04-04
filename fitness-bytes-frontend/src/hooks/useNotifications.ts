import { useInfiniteQuery } from "@tanstack/react-query";
import NotificationServices from "../services/NotificationServices";

const PAGE_LENGTH = 10;

const useNotifications = () => {

    return useInfiniteQuery({
        queryKey: ["notifications"],
        queryFn: ({pageParam = 0}) => NotificationServices.getAll(pageParam, PAGE_LENGTH),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return 0;
            return (lastPage?.length || 0) >= PAGE_LENGTH ?  allPages.length + 1 : undefined;
        },
    })
}

export default useNotifications;