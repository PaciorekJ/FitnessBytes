import { useQuery } from "@tanstack/react-query";
import ClientService from "../services/ClientService";
import useUserStore from "./useUserStore";

const useIsLiked = (postId: string) => {

    const userId = useUserStore((s) => s._id);

    const client = new ClientService<boolean>('/user/post/liked');

    return useQuery({
        queryKey: [`IsLiked-${postId}`, userId, postId],
        queryFn: () => client.post({
            userId: userId,
            postId: postId,
        })
    })

}

export default useIsLiked;