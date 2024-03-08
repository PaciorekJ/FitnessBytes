
import { useQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";

const usePost = (_id: string = "") => {
    return useQuery({
        queryKey: [`post-${_id}`],
        queryFn: () => PostServices.getOne(_id),
    });
}

export default usePost;