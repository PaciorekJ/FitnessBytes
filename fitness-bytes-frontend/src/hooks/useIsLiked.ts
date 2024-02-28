import { useQuery } from "@tanstack/react-query";
import ClientService from "../services/ClientService";

const useIsLiked = (postId: string) => {

    const client = new ClientService<boolean>('/user/post/liked');

    return useQuery({
        queryKey: [`IsLiked-${postId}`, postId],
        queryFn: () => client.post({
            postId: postId,
        })
    })

}

export default useIsLiked;