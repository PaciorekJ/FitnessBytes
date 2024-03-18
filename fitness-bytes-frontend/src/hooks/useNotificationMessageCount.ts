import { useQuery } from "@tanstack/react-query";
import NotificationServices from "../services/NotificationServices";

const useNotificationMessageCount = () => {
    return useQuery({
        queryKey: [`NotificationMessageCount`],
        queryFn: NotificationServices.getMessageCount,
    });
}

export default useNotificationMessageCount;