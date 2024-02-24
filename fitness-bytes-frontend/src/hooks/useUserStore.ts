
import { create } from 'zustand';

interface UserState {
    _id: string;
    username: string;
    setUser: (_id: string, username: string) => void;
}

const useUserStore = create<UserState>((set) => ({
    _id: "",
    username: "",
    setUser: (_id, username) => set(() => ({_id, username}))
}))

export default useUserStore;