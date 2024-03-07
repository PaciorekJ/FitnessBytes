import { useQuery } from "@tanstack/react-query";
import Post from "../interfaces/Post";
import ClientService from "../services/HTTP-Services/ClientService";

const usePosts = (username: string = "") => {
    const client = 
        username?
        new ClientService<Post[]>(`/posts/${username}`)
        : new ClientService<Post[]>(`/posts`);
        
    return useQuery({
        queryKey: ['posts'],
        queryFn: client.get,
    });
}

export default usePosts;