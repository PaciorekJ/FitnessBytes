import { useQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";

const usePosts = (username: string = "") => {
    return useQuery({
    queryKey: ['posts', username],
        queryFn: () => PostServices.getAll(username),
    });
}

export default usePosts;