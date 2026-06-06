import { z } from 'zod'
import type { FormField, FormSchema } from '../../../shared/types/form'

// Create Zod schema from FormField
export function createFieldSchema(field: FormField): z.ZodTypeAny {
  let schema: z.ZodTypeAny

  switch (field.type) {
    case 'text':
    case 'textarea':
      schema = z.string()
      if (field.validation?.minLength) {
        schema = (schema as z.ZodString).min(field.validation.minLength)
      }
      if (field.validation?.maxLength) {
        schema = (schema as z.ZodString).max(field.validation.maxLength)
      }
      if (field.validation?.pattern) {
        schema = (schema as z.ZodString).regex(new RegExp(field.validation.pattern))
      }
      break
    case 'number':
      schema = z.number()
      if (field.validation?.min !== undefined) {
        schema = (schema as z.ZodNumber).min(field.validation.min)
      }
      if (field.validation?.max !== undefined) {
        schema = (schema as z.ZodNumber).max(field.validation.max)
      }
      break
    case 'date':
      schema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
      break
    case 'select':
      const values = field.options?.map((o) => o.value) || []
      schema = z.enum(values as [string, ...string[]])
      break
    case 'checkbox':
      schema = z.boolean()
      break
    default:
      schema = z.unknown()
  }

  if (!field.required) {
    schema = schema.optional()
  }

  return schema
}

// Create full form schema from FormSchema
export function createFormZodSchema(
  formSchema: FormSchema
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {}

  for (const field of formSchema.fields) {
    shape[field.id] = createFieldSchema(field)
  }

  return z.object(shape)
}
