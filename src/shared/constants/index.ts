// IPC Channel names
export const IPC_CHANNELS = {
  DOCUMENT_GENERATE_HWPX: 'document:generate-hwpx',
  DOCUMENT_GENERATE_XLSX: 'document:generate-xlsx',
  FILE_SAVE_DIALOG: 'file:save-dialog',
  FILE_OPEN_FOLDER: 'file:open-folder'
} as const

// Document types
export const DOCUMENT_TYPES = {
  HWPX: 'hwpx',
  XLSX: 'xlsx'
} as const

// Form field types
export const FORM_FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  TEXTAREA: 'textarea'
} as const
