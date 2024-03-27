
import { useQuery } from '@tanstack/react-query'
import UserConfigServices from '../services/UserConfigServices'

const useUserConfig = () => {
    return useQuery({
        queryKey: ["userConfig"],
        queryFn: UserConfigServices.get,
    });
}

export default useUserConfig