import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'
type Language = 'ko' | 'en'

interface SettingsState {
  theme: Theme
  language: Language
  recentPaths: string[]
  defaultOutputDir: string
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  addRecentPath: (path: string) => void
  setDefaultOutputDir: (path: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'ko',
      recentPaths: [],
      defaultOutputDir: '',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      addRecentPath: (path) =>
        set((state) => ({
          recentPaths: [path, ...state.recentPaths.filter((p) => p !== path)].slice(0, 10)
        })),
      setDefaultOutputDir: (path) => set({ defaultOutputDir: path })
    }),
    { name: 'wildboar-settings' }
  )
)
