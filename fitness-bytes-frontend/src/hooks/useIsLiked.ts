import { useQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";
import ReplyServices from "../services/ReplyServices";


export enum LikeId {
    postId,
    replyId
}

const useIsLiked = (id: string, type: LikeId) => {

    const queryKey = [`IsLiked-${id}`, id, type];
    let queryFn;

    switch (type) {
        case LikeId.postId:
            queryFn = () => PostServices.isLiked(id);
            break;
        case LikeId.replyId:
            queryFn = () => ReplyServices.isLiked(id);
            break;
            
    } 

    return useQuery({
        queryKey,
        queryFn,
        enabled: !!id,
    })

}

export default useIsLiked;