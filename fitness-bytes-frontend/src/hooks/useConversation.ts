import { useQuery } from "@tanstack/react-query";
import ConversationServices from "../services/ConversationService";

const useConversation = (id: string) => {
    return useQuery({
        queryKey: [`conversation-${id}`, id],
        queryFn: () => ConversationServices.getOne(id),
        enabled: !!id,
    })
}

export default useConversation;