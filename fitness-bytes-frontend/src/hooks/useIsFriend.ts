import { useQuery } from "@tanstack/react-query";
import FriendServices from "../services/FriendServices";

const useIsFriend = (username: string) => {

    return useQuery({
        queryKey: [`isFriend-${username}`, username],
        queryFn: () => FriendServices.isFriend(username),
        enabled: !!username,
    })
}

export default useIsFriend;