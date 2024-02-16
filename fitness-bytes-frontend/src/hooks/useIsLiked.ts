import { useQuery } from "@tanstack/react-query";
import ClientService from "../services/ClientService";

const useIsLiked = (postId: string) => {

    const userId = localStorage.getItem('_id') || "";

    const client = new ClientService<boolean>('/user/post/liked');

    return useQuery({
        queryKey: ['IsLiked', userId, postId],
        queryFn: () => client.post({
            userId: userId,
            postId: postId,
        })
    })

}

export default useIsLiked;