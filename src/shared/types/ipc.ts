import type { DocumentGenerationRequest, DocumentGenerationResult } from './document'

export interface IpcChannels {
  'document:generate-hwpx': {
    request: DocumentGenerationRequest
    response: DocumentGenerationResult
  }
  'document:generate-xlsx': {
    request: DocumentGenerationRequest
    response: DocumentGenerationResult
  }
  'file:save-dialog': {
    request: { defaultName: string; filters: FileFilter[]; defaultPath?: string }
    response: { canceled: boolean; filePath?: string }
  }
  'file:open-folder': {
    request: { path: string }
    response: void
  }
  'file:select-directory': {
    request: { defaultPath?: string }
    response: { canceled: boolean; path?: string }
  }
  'file:get-documents-dir': {
    request: void
    response: { path: string }
  }
}

export interface FileFilter {
  name: string
  extensions: string[]
}
