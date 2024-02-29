import { useQuery } from "@tanstack/react-query";
import ClientService from "../services/ClientService";

const useIsLiked = (postId: string) => {

    const client = new ClientService<boolean>(`/post/liked/${postId}`);

    return useQuery({
        queryKey: [`IsLiked-${postId}`, postId],
        queryFn: () => client.get()
    })

}

export default useIsLiked;