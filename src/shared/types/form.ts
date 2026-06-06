export interface FormField {
  id: string
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'textarea'
  label: string
  placeholder?: string
  required?: boolean
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
  }
  options?: Array<{ label: string; value: string }>
  defaultValue?: unknown
}

export interface FormSchema {
  id: string
  name: string
  description?: string
  fields: FormField[]
  hwpxMapping: Record<string, string>
  xlsxMapping: Record<string, { sheet: string; cell: string }>
}

export type FormData = Record<string, unknown>
