import { useQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";

const usePostImage = (id: string) => {
    return useQuery({
        queryKey: [`postImage-${id}`, id],
        queryFn: () => PostServices.getImage(id)
    })
}

export default usePostImage;