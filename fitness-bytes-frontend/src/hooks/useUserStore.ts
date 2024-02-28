
import { create } from 'zustand';

interface State {
    username: string;
}

interface Action {
    setUser: (username: string) => void;
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
    username: getStore().username || "",
    setUser: (username) => set(() => {
        localStorage.setItem('userStore', JSON.stringify({username}))
        return ({username})
    })
}))

export default useUserStore;