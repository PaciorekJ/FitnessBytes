import { useQuery } from "@tanstack/react-query";
import Conversation from "../interfaces/Conversation";
import ClientService from "../services/HTTP-Services/ClientService";

const useConversations = () => {
    const client = new ClientService<Conversation[]>('/conversation/');

    return useQuery({
        queryKey: ["conversations"],
        queryFn: client.get
    });
} 

export default useConversations