

import { useQuery } from "@tanstack/react-query";
import ReplyServices from "../services/ReplyServices";

const useReply = (id: string) => {
    return useQuery({
        queryKey: [`reply-${id}`, id],
        queryFn: () => ReplyServices.get(id),
        enabled: !!id,
    });
}

export default useReply;