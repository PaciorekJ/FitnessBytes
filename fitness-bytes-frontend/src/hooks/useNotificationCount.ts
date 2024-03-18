

import { useQuery } from "@tanstack/react-query";
import NotificationServices from "../services/NotificationServices";

const useNotificationCount = () => {
    return useQuery({
        queryKey: [`NotificationCount`],
        queryFn: NotificationServices.getCount,
    });
}

export default useNotificationCount;