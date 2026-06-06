export interface DocumentGenerationRequest {
  data: Record<string, unknown>
  outputPath: string
  schemaId: string
}

export interface DocumentGenerationResult {
  success: boolean
  path?: string
  error?: string
}

export type DocumentType = 'hwpx' | 'xlsx'
