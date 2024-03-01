import { useQuery } from "@tanstack/react-query";
import IMessage from "../interfaces/Message";
import ClientService from "../services/ClientService";

const useConversation = (id: string) => {
    const client = new ClientService<IMessage[]>(`/message/${id}`);

    return useQuery({
        queryKey: [`conversation-${id}`, id],
        queryFn: client.get,
    })
}

export default useConversation;