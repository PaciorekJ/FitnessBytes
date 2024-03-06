import { useQuery } from "@tanstack/react-query";
import { INotification } from "../interfaces/Notifcations";
import ClientService from "../services/ClientService";

const useNotifications = () => {
    const client = new ClientService<INotification[]>('/notifications'); 

    return useQuery({
        queryKey: ["notifications"],
        queryFn: client.get,
    })
}

export default useNotifications;