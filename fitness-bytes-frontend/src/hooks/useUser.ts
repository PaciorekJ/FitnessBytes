import { useQuery } from "@tanstack/react-query";
import UserServices from "../services/UserServices";

const useUser = (username: string) => {
    return useQuery({
        queryKey: [`users-${username}`, username],
        queryFn: () => UserServices.get(username),
    });
}

export default useUser;