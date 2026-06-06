import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { DocumentGenerationRequest, DocumentGenerationResult } from '../shared/types'

const api = {
  // Document generation APIs
  generateHwpx: (request: DocumentGenerationRequest): Promise<DocumentGenerationResult> => {
    return ipcRenderer.invoke('document:generate-hwpx', request)
  },
  generateXlsx: (request: DocumentGenerationRequest): Promise<DocumentGenerationResult> => {
    return ipcRenderer.invoke('document:generate-xlsx', request)
  },
  // File operation APIs
  saveDialog: (options: {
    defaultName: string
    filters: { name: string; extensions: string[] }[]
    defaultPath?: string
  }): Promise<{ canceled: boolean; filePath?: string }> => {
    return ipcRenderer.invoke('file:save-dialog', options)
  },
  openFolder: (path: string): Promise<void> => {
    return ipcRenderer.invoke('file:open-folder', { path })
  },
  selectDirectory: (options?: {
    defaultPath?: string
  }): Promise<{ canceled: boolean; path?: string }> => {
    return ipcRenderer.invoke('file:select-directory', options || {})
  },
  getDocumentsDir: (): Promise<{ path: string }> => {
    return ipcRenderer.invoke('file:get-documents-dir')
  },
  // App info APIs
  getVersion: (): string => {
    return ipcRenderer.sendSync('app:get-version')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error - Type assignment for non-isolated context
  window.electron = electronAPI
  // @ts-expect-error - Type assignment for non-isolated context
  window.api = api
}
