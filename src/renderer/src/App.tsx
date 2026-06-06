import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { MainLayout } from './components/layout'
import { FormBuilder, GenerationProgress } from './components/form'
import { useDocumentGeneration } from './hooks'
import { useSettingsStore } from './stores'
import { basicDocumentSchema } from '../../shared/schemas/basicDocument'
import type { FormData } from '../../shared/types/form'

function App(): JSX.Element {
  const { theme, setTheme, outputFilePath } = useSettingsStore()
  const { state, generateDocument, openGeneratedFile, reset } = useDocumentGeneration()

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleSubmit = async (data: FormData) => {
    // Generate directly to the pre-selected output path (no second dialog).
    await generateDocument('hwpx', data, basicDocumentSchema.id, outputFilePath)
  }

  // Apply theme class to document
  React.useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return (
    <MainLayout showSidebar={false} showHeader={false}>
      <button
        type="button"
        onClick={handleThemeToggle}
        aria-label="테마 토글"
        title="테마 토글"
        className="fixed right-3 top-3 z-50 rounded-md p-2 text-muted-foreground opacity-60 hover:bg-accent hover:opacity-100"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
      <div className="flex h-full flex-col">
        <FormBuilder
          schema={basicDocumentSchema}
          onSubmit={handleSubmit}
          isGenerating={state.isGenerating}
        />

        {state.status !== 'idle' && (
          <GenerationProgress
            status={state.status}
            message={state.message}
            onOpenFile={openGeneratedFile}
            onRetry={() => {}}
            onReset={reset}
          />
        )}
      </div>
    </MainLayout>
  )
}

export default App
