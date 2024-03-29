import { useQuery } from "@tanstack/react-query";
import MessageServices from "../services/MessageServices";

const useMessages = (id: string) => {
    return useQuery({
        queryKey: [`messages-${id}`, id],
        queryFn: () => MessageServices.getAll(id),
    })
}

export default useMessages;