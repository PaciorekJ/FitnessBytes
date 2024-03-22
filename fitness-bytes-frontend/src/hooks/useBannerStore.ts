import { create } from 'zustand';
import { INotification } from '../services/NotificationServices';

interface State {
    isOpen: boolean;
    banner: {notification: INotification | string, error: boolean};
}

interface Action {
    setOpen: (isOpen: boolean) => void;
    setBanner: (notification: INotification | string, error?: boolean) => void;
}

const useBannerStore = create<State & Action>((set) => ({
    isOpen: false,
    banner: { 
        notification: "", 
        error: false 
    },
    setOpen: (isOpen) => set((s) => { 
        return {
            ...s,
            isOpen,
        }
    }),
    setBanner: (notification, error) => set((s) => { 
        return {
            ...s,
            banner: {
                notification,
                error: error? true: false,
            },
            isOpen: true,
        } 
})
}))

export default useBannerStore;