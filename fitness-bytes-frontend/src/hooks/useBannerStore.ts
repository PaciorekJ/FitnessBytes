import { create } from 'zustand';
import { INotification } from '../services/NotificationServices';

interface State {
    isOpen: boolean;
    notification: INotification | null;
}

interface Action {
    setOpen: (isOpen: boolean) => void;
    setNotification: (isOpen: INotification) => void;
}

const useBannerStore = create<State & Action>((set) => ({
    isOpen: false,
    notification: null,
    setOpen: (isOpen) => set((s) => { return {
        ...s,
        isOpen,
    }}),
    setNotification: (notification) => set((s) => { return {
        ...s,
        notification,
        isOpen: true,
    }})
}))

export default useBannerStore;