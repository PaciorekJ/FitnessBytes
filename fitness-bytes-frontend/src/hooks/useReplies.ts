
import { useQuery } from "@tanstack/react-query";
import ReplyServices, { IReplyNode } from "../services/ReplyServices";

const useReplies = ({rootId, parentId}: IReplyNode) => {
    const queryFn = parentId ? () => ReplyServices.getFromReply(parentId): () => ReplyServices.getFromPost(rootId)
    const queryKey = parentId ? ["repliesByReplyId", parentId]: ["repliesByPostId", rootId]

    return useQuery({
        queryKey,
        queryFn,
        enabled: (!!rootId) || (!!rootId && !!parentId),
    })
}

export default useReplies;