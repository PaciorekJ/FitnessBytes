
import { useQuery } from "@tanstack/react-query";
import ClientService from "../services/HTTP-Services/ClientService";

const usePostCount = (username: string) => {
    const client = new ClientService<number>(`/posts/count/${username}`)
    
    return useQuery({
        queryKey: [`userPostCount-${username}`],
        queryFn: client.get,
    });
}

export default usePostCount;