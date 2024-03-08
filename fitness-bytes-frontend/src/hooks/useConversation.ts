import { useQuery } from "@tanstack/react-query";
import MessageServices from "../services/MessageServices";

const useConversation = (id: string) => {

    return useQuery({
        queryKey: [`conversation-${id}`, id],
        queryFn: () => MessageServices.getAll(id),
    })
}

export default useConversation;