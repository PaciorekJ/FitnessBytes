import { useInfiniteQuery } from "@tanstack/react-query";
import MessageServices from "../services/MessageServices";

const PAGE_LENGTH = 5;

const useMessages = (id: string) => {
    
    return useInfiniteQuery({
        queryKey: [`messages-${id}`, id],
        queryFn: ({pageParam = 0}) => MessageServices.getAll(id, pageParam, PAGE_LENGTH),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
			return lastPage?.length !== 0 ? allPages.length + 1 : undefined
        },
    })
}

export default useMessages;