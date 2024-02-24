
import { useQuery } from "@tanstack/react-query";
import Post from "../interfaces/Post";
import ClientService from "../services/ClientService";

const usePosts = (postId: string | undefined) => {
    const client = new ClientService<Post>(`/post/${postId}`);
    
    return useQuery({
        queryKey: ['post'],
        queryFn: client.get,
    });
}

export default usePosts;