import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FormData, FormSchema } from '../../../shared/types/form'

interface FormState {
  currentSchema: FormSchema | null
  formData: FormData
  isDirty: boolean
  setSchema: (schema: FormSchema) => void
  setFormData: (data: FormData) => void
  updateField: (fieldId: string, value: unknown) => void
  resetForm: () => void
  setDirty: (dirty: boolean) => void
}

export const useFormStore = create<FormState>()(
  persist(
    (set) => ({
      currentSchema: null,
      formData: {},
      isDirty: false,
      setSchema: (schema) => set({ currentSchema: schema }),
      setFormData: (data) => set({ formData: data, isDirty: true }),
      updateField: (fieldId, value) =>
        set((state) => ({
          formData: { ...state.formData, [fieldId]: value },
          isDirty: true
        })),
      resetForm: () => set({ formData: {}, isDirty: false }),
      setDirty: (dirty) => set({ isDirty: dirty })
    }),
    {
      name: 'wildboar-form-draft',
      partialize: (state) => ({ formData: state.formData })
    }
  )
)
