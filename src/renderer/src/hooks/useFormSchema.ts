import { useMemo } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { FormSchema, FormData } from '../../../shared/types/form'
import { createFormZodSchema } from '../lib/formValidation'
import { useFormStore } from '../stores/formStore'

export interface UseFormSchemaReturn {
  form: UseFormReturn<FormData>
  schema: FormSchema | null
  isReady: boolean
}

export function useFormSchema(schemaInput?: FormSchema): UseFormSchemaReturn {
  const { currentSchema, formData } = useFormStore()

  const schema = schemaInput || currentSchema

  const zodSchema = useMemo(() => {
    if (!schema) return null
    return createFormZodSchema(schema)
  }, [schema])

  const form = useForm<FormData>({
    resolver: zodSchema ? zodResolver(zodSchema) : undefined,
    defaultValues: formData,
    mode: 'onChange'
  })

  return {
    form,
    schema,
    isReady: !!schema && !!zodSchema
  }
}
