import { useQuery } from "@tanstack/react-query";
import ReplyServices from "../services/ReplyServices";


interface ReplyCount {
    postId?: string;
    replyId?: string;
}

const useReplyCount = ({postId, replyId}: ReplyCount) => {
    const queryFn = postId ? () => ReplyServices.getReplyToPostCount(postId) : () => ReplyServices.getReplyToReplyCount(replyId!);
    const queryKey = postId ? ["replyCountByPostId", postId] : ["replyCountByReply", replyId];

    return useQuery({
        queryKey,
        queryFn,
        enabled: !!postId || !!replyId,
    })
}

export default useReplyCount;