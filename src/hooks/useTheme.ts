import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const useTheme = create<ThemeState>()(
    persist(
        (set) => ({
            theme: 'system',
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
