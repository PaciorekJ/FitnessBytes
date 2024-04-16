
import { useInfiniteQuery } from "@tanstack/react-query";
import ReplyServices, { IReplyNode } from "../services/ReplyServices";

const PAGE_LENGTH = 5;

const useReplies = ({rootId, parentId}: IReplyNode) => {
    const queryFn = parentId ? ({pageParam = 0}) => ReplyServices.getFromReply(parentId, pageParam, PAGE_LENGTH): ({pageParam = 0}) => ReplyServices.getFromPost(rootId, pageParam, PAGE_LENGTH)
    const queryKey = parentId ? ["repliesByReplyId", parentId]: ["repliesByPostId", rootId]

    return useInfiniteQuery({
        queryKey,
        queryFn,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return 0;
            return (lastPage?.length || 0) >= PAGE_LENGTH ?  allPages.length + 1 : undefined;
        },
        enabled: (!!rootId) || (!!rootId && !!parentId),
    })
}

export default useReplies;