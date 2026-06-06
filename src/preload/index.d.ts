import { ElectronAPI } from '@electron-toolkit/preload'
import type { DocumentGenerationRequest, DocumentGenerationResult } from '../shared/types'

export interface Api {
  generateHwpx(request: DocumentGenerationRequest): Promise<DocumentGenerationResult>
  generateXlsx(request: DocumentGenerationRequest): Promise<DocumentGenerationResult>
  saveDialog(options: {
    defaultName: string
    filters: Array<{ name: string; extensions: string[] }>
    defaultPath?: string
  }): Promise<{ canceled: boolean; filePath?: string }>
  openFolder(path: string): Promise<void>
  selectDirectory(options?: { defaultPath?: string }): Promise<{ canceled: boolean; path?: string }>
  getVersion(): string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
