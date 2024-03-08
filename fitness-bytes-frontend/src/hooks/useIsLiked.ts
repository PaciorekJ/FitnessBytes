import { useQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";

const useIsLiked = (postId: string) => {

    return useQuery({
        queryKey: [`IsLiked-${postId}`, postId],
        queryFn: () => PostServices.isLiked(postId)
    })

}

export default useIsLiked;