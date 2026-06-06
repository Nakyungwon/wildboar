import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { FormData } from '../../../shared/types/form'
import type { DocumentGenerationResult, DocumentType } from '../../../shared/types/document'
import { useSettingsStore } from '../stores/settingsStore'

interface GenerationState {
  isGenerating: boolean
  progress: number
  status: 'idle' | 'generating' | 'success' | 'error'
  message: string
  filePath?: string
}

export interface UseDocumentGenerationReturn {
  state: GenerationState
  generateDocument: (
    type: DocumentType,
    data: FormData,
    schemaId: string
  ) => Promise<DocumentGenerationResult>
  openGeneratedFile: () => void
  reset: () => void
}

export function useDocumentGeneration(): UseDocumentGenerationReturn {
  const { t } = useTranslation()
  const { addRecentPath, defaultOutputDir, setDefaultOutputDir } = useSettingsStore()

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    status: 'idle',
    message: ''
  })

  const generateDocument = useCallback(
    async (
      type: DocumentType,
      data: FormData,
      schemaId: string
    ): Promise<DocumentGenerationResult> => {
      setState({
        isGenerating: true,
        progress: 0,
        status: 'generating',
        message: t('document.generating')
      })

      try {
        // Open save dialog
        const filters =
          type === 'hwpx'
            ? [{ name: t('document.hwpx'), extensions: ['hwpx'] }]
            : [{ name: t('document.xlsx'), extensions: ['xlsx'] }]

        const defaultName = `document.${type}`
        const dialogResult = await window.api.saveDialog({
          defaultName,
          filters,
          defaultPath: defaultOutputDir || undefined
        })

        if (dialogResult.canceled || !dialogResult.filePath) {
          setState({ isGenerating: false, progress: 0, status: 'idle', message: '' })
          return { success: false, error: 'Cancelled by user' }
        }

        setState((prev) => ({ ...prev, progress: 50 }))

        // Generate document
        const result =
          type === 'hwpx'
            ? await window.api.generateHwpx({ data, outputPath: dialogResult.filePath, schemaId })
            : await window.api.generateXlsx({ data, outputPath: dialogResult.filePath, schemaId })

        if (result.success && result.path) {
          addRecentPath(result.path)
          // Save the directory as default for next time
          const lastSeparator = Math.max(
            result.path.lastIndexOf('/'),
            result.path.lastIndexOf('\\')
          )
          if (lastSeparator > 0) {
            setDefaultOutputDir(result.path.substring(0, lastSeparator))
          }
          setState({
            isGenerating: false,
            progress: 100,
            status: 'success',
            message: t('document.success'),
            filePath: result.path
          })
        } else {
          setState({
            isGenerating: false,
            progress: 0,
            status: 'error',
            message: result.error || t('document.error')
          })
        }

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t('document.error')
        setState({
          isGenerating: false,
          progress: 0,
          status: 'error',
          message: errorMessage
        })
        return { success: false, error: errorMessage }
      }
    },
    [t, addRecentPath, defaultOutputDir, setDefaultOutputDir]
  )

  const openGeneratedFile = useCallback(() => {
    if (state.filePath) {
      // Handle both Windows (\) and Unix (/) path separators
      const lastSeparator = Math.max(
        state.filePath.lastIndexOf('/'),
        state.filePath.lastIndexOf('\\')
      )
      const folder = lastSeparator > 0 ? state.filePath.substring(0, lastSeparator) : state.filePath
      window.api.openFolder(folder)
    }
  }, [state.filePath])

  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      progress: 0,
      status: 'idle',
      message: ''
    })
  }, [])

  return { state, generateDocument, openGeneratedFile, reset }
}
