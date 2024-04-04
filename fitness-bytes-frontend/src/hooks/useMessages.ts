import { useInfiniteQuery } from "@tanstack/react-query";
import MessageServices from "../services/MessageServices";

const PAGE_LENGTH = 10;

const useMessages = (id: string) => {
    
    return useInfiniteQuery({
        queryKey: [`messages-${id}`, id],
        queryFn: ({pageParam = 0}) => MessageServices.getAll(id, pageParam, PAGE_LENGTH),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return 0;
            return (lastPage?.length || 0) >= PAGE_LENGTH ?  allPages.length + 1 : undefined;
        },
        enabled: !!id,
    })
}

export default useMessages;