import { useEffect, useRef } from 'react'
import { useFormStore } from '../stores/formStore'
import type { FormData } from '../../../shared/types/form'

const AUTOSAVE_DELAY = 1000 // 1 second debounce

export function useAutoSave(formData: FormData, enabled = true): void {
  const { setFormData, isDirty } = useFormStore()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled || !isDirty) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setFormData(formData)
    }, AUTOSAVE_DELAY)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [formData, enabled, isDirty, setFormData])
}
