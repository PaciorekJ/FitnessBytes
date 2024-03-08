
import { useQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";

const usePostCount = (username: string) => {

    return useQuery({
        queryKey: [`userPostCount-${username}`],
        queryFn: () => PostServices.getCount(username),
    });
}

export default usePostCount;