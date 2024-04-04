
import { useQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";

const usePost = (id: string) => {
    return useQuery({
        queryKey: [`post-${id}`, id],
        queryFn: () => PostServices.getOne(id),
        enabled: !!id,
    });
}

export default usePost;