import { ipcMain } from 'electron'
import type { IpcChannels } from '../../shared/types/ipc'
import type { FormSchema, FormData } from '../../shared/types/form'
import { generateHwpx } from '../services/hwpxService'
import { generateXlsx } from '../services/xlsxService'
import { basicDocumentSchema } from '../../shared/schemas/basicDocument'
import { isPathSafe } from '../lib/validation'

// Schema registry - maps schemaId to schema definition
const schemaRegistry: Record<string, FormSchema> = {
  'basic-document': basicDocumentSchema
}

function getSchema(schemaId: string): FormSchema | null {
  return schemaRegistry[schemaId] || null
}

export function registerDocumentHandlers(): void {
  // document:generate-hwpx - Generate HWPX document
  ipcMain.handle(
    'document:generate-hwpx',
    async (
      _event,
      request: IpcChannels['document:generate-hwpx']['request']
    ): Promise<IpcChannels['document:generate-hwpx']['response']> => {
      try {
        const { data, outputPath, schemaId } = request

        // Validate output path for security
        if (!isPathSafe(outputPath)) {
          return {
            success: false,
            error: 'Output path is not within allowed directories'
          }
        }

        // Load the schema
        const schema = getSchema(schemaId)
        if (!schema) {
          return {
            success: false,
            error: `Schema not found: ${schemaId}`
          }
        }

        // Call the HWPX generation service
        const result = await generateHwpx(data as FormData, schema, outputPath)
        return result
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  )

  // document:generate-xlsx - Generate XLSX document
  ipcMain.handle(
    'document:generate-xlsx',
    async (
      _event,
      request: IpcChannels['document:generate-xlsx']['request']
    ): Promise<IpcChannels['document:generate-xlsx']['response']> => {
      try {
        const { data, outputPath, schemaId } = request

        // Validate output path for security
        if (!isPathSafe(outputPath)) {
          return {
            success: false,
            error: 'Output path is not within allowed directories'
          }
        }

        // Load the schema
        const schema = getSchema(schemaId)
        if (!schema) {
          return {
            success: false,
            error: `Schema not found: ${schemaId}`
          }
        }

        // Call the XLSX generation service
        const result = await generateXlsx(data as FormData, schema, outputPath)
        return result
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  )
}
