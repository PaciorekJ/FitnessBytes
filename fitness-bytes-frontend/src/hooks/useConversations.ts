import { useQuery } from "@tanstack/react-query";
import ConversationServices from "../services/ConversationService";

const useConversations = () => {

    return useQuery({
        queryKey: ["conversations"],
        queryFn: ConversationServices.getAll
    });
} 

export default useConversations