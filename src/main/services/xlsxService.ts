import { Workbook } from 'exceljs'
import type { FormSchema, FormData } from '../../shared/types/form'
import type { DocumentGenerationResult } from '../../shared/types/document'

export async function generateXlsx(
  data: FormData,
  schema: FormSchema,
  outputPath: string
): Promise<DocumentGenerationResult> {
  try {
    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet('Sheet1')

    // Set column widths
    worksheet.columns = [
      { header: '항목', key: 'label', width: 20 },
      { header: '값', key: 'value', width: 40 }
    ]

    // Add data rows
    for (const field of schema.fields) {
      const value = data[field.id]
      worksheet.addRow({
        label: field.label,
        value: value !== undefined && value !== null ? String(value) : ''
      })
    }

    // Style header row
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }

    await workbook.xlsx.writeFile(outputPath)

    return { success: true, path: outputPath }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
