
import { useQuery } from "@tanstack/react-query";
import PostServices from "../services/PostServices";

const usePostCount = (username: string) => {

    return useQuery({
        queryKey: [`userPostCount-${username}`, username],
        queryFn: () => PostServices.getCount(username),
        enabled: !!username,
    });
}

export default usePostCount;