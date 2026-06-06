import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'
type Language = 'ko' | 'en'

interface SettingsState {
  theme: Theme
  language: Language
  recentPaths: string[]
  defaultOutputDir: string
  /** Full path (incl. filename) chosen via the save dialog for the next generation. Session-only. */
  outputFilePath: string
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  addRecentPath: (path: string) => void
  setDefaultOutputDir: (path: string) => void
  setOutputFilePath: (path: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'ko',
      recentPaths: [],
      defaultOutputDir: '',
      outputFilePath: '',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      addRecentPath: (path) =>
        set((state) => ({
          recentPaths: [path, ...state.recentPaths.filter((p) => p !== path)].slice(0, 10)
        })),
      setDefaultOutputDir: (path) => set({ defaultOutputDir: path }),
      setOutputFilePath: (path) => set({ outputFilePath: path })
    }),
    {
      name: 'wildboar-settings',
      // Don't persist the chosen output file across sessions — pick fresh each run.
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        recentPaths: state.recentPaths,
        defaultOutputDir: state.defaultOutputDir
      })
    }
  )
)
