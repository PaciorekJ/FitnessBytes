import { useQuery } from "@tanstack/react-query";
import NotificationServices from "../services/NotificationServices";

const useNotifications = () => {

    return useQuery({
        queryKey: ["notifications"],
        queryFn: NotificationServices.getAll,
    })
}

export default useNotifications;