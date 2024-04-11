import { useQuery } from "@tanstack/react-query";
import UserServices from "../services/UserServices";

const useUser = (identifier: string) => {
    return useQuery({
        queryKey: [`users-${identifier}`, identifier],
        queryFn: () => UserServices.get(identifier),
        enabled: !!identifier
    });
}

export default useUser;