import { useQuery } from "@tanstack/react-query";
import ReplyServices, { IReplyNode } from "../services/ReplyServices";

const useReplyCount = ({rootId, parentId}: IReplyNode) => {
    const queryFn = parentId ? () => ReplyServices.getReplyToReplyCount(parentId) : () => ReplyServices.getReplyToPostCount(rootId);
    const queryKey = parentId ? ["replyCountByReply", parentId] : ["replyCountByPostId", rootId];

    return useQuery({
        queryKey,
        queryFn,
        enabled: (!!rootId) || (!!rootId && !!parentId),
    })
}

export default useReplyCount;