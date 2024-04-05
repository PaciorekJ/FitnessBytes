import { create } from 'zustand';

type ThemeMode = 'dark' | 'light';

interface Theme {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const useThemeStore = create<Theme>(set => {

    let nativeDark;
    let nativeLight;

    // Check for native darkMode settings
    if (window.matchMedia) {
        nativeDark = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '';
        nativeLight = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : '';
    }

    // Check localStorage for darkMode settings
    const localStorageLight = localStorage.getItem('themeMode') === 'light' ? 'light' : '';
    const localStorageDark = localStorage.getItem('themeMode') === 'dark' ? 'dark' : '';
    
    const defaultMode = 'dark';

    const mode = localStorageDark || localStorageLight || nativeLight || nativeDark || defaultMode;
    
    return {
    
    mode: (mode as ThemeMode),
    
    toggleTheme: () => set((state) => {
        const newMode = state.mode === 'dark' ? 'light' : 'dark';
        
        localStorage.setItem('themeMode', newMode);
        return { mode: newMode };
    }),
}});

export default useThemeStore;