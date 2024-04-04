import { useQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";

const useIsLiked = (id: string) => {

    return useQuery({
        queryKey: [`IsLiked-${id}`, id],
        queryFn: () => PostServices.isLiked(id),
        enabled: !!id,
    })

}

export default useIsLiked;