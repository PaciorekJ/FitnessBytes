
import { create } from 'zustand';

interface State {
    _id: string;
    username: string;
}

interface Action {
    setUser: (_id: string, username: string) => void;
}

const getStore = () => {
    try {
        const userStore: State = JSON.parse(localStorage.getItem('userStore') || "");
        return userStore;
    } catch {
        return {} as State;
    }
}

const useUserStore = create<State & Action>((set) => ({
    _id: getStore()._id || "",
    username: getStore().username || "",
    setUser: (_id, username) => set(() => {
        localStorage.setItem('userStore', JSON.stringify({_id, username}))
        return ({_id, username})
    })
}))

export default useUserStore;