import { useQuery } from "@tanstack/react-query";
import Post from "../interfaces/Post";
import ClientService from "../services/ClientService"

const usePosts = () => {
    const client = new ClientService<Post[]>('/posts');

    return useQuery({
        queryKey: ['posts'],
        queryFn: client.get,
    });
}

export default usePosts;