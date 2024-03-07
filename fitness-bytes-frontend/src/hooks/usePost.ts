
import { useQuery } from "@tanstack/react-query";
import Post from "../interfaces/Post";
import ClientService from "../services/HTTP-Services/ClientService";

const usePost = (postId: string = "") => {
    const client = new ClientService<Post>(`/post/${postId}`);

    return useQuery({
        queryKey: [`post-${postId}`],
        queryFn: client.get,
    });
}

export default usePost;