
import { useQuery } from "@tanstack/react-query";
import ReplyServices from "../services/ReplyServices";


interface ReplyCount {
    postId?: string;
    replyId?: string;
}

const useReplies = ({postId, replyId}: ReplyCount) => {
    const queryFn = postId ? () => ReplyServices.getFromPost(postId) : () => ReplyServices.getFromReply(replyId!);
    const queryKey = postId ? ["repliesByPostId", postId] : ["repliesByReplyId", replyId];

    return useQuery({
        queryKey,
        queryFn,
        enabled: !!postId || !!replyId,
    })
}

export default useReplies;