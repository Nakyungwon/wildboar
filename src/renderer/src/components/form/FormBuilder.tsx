import { FormProvider } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { FormSchema, FormData } from '../../../../shared/types/form'
import { useFormSchema } from '../../hooks/useFormSchema'
import { useAutoSave } from '../../hooks/useAutoSave'
import { useSettingsStore } from '../../stores/settingsStore'
import { FormField } from './FormField'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card'
import type { FieldError } from 'react-hook-form'

interface FormBuilderProps {
  schema: FormSchema
  onSubmit: (data: FormData) => Promise<void>
  isGenerating?: boolean
}

export function FormBuilder({ schema, onSubmit, isGenerating = false }: FormBuilderProps) {
  const { t } = useTranslation()
  const { form, isReady } = useFormSchema(schema)
  const { defaultOutputDir, setDefaultOutputDir } = useSettingsStore()

  const handleSelectDirectory = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const result = await window.api.selectDirectory({
        defaultPath: defaultOutputDir || undefined
      })
      if (!result.canceled && result.path) {
        setDefaultOutputDir(result.path)
      }
    } catch (error) {
      console.error('Error selecting directory:', error)
    }
  }

  // Auto-save form data
  useAutoSave(form.watch(), isReady)

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  const handleReset = () => {
    form.reset({})
  }

  if (!isReady) {
    return <div>Loading...</div>
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <Card className="flex flex-1 flex-col">
          <CardHeader>
            <CardTitle>{schema.name}</CardTitle>
            {schema.description && <CardDescription>{schema.description}</CardDescription>}
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-y-auto">
            {schema.fields.map((field) => (
              <FormField
                key={field.id}
                field={field}
                control={form.control}
                error={form.formState.errors[field.id] as FieldError | undefined}
              />
            ))}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-medium">{t('settings.outputDirectory')}</label>
                  <div className="mt-1 px-3 py-2 bg-muted rounded-md text-sm truncate text-muted-foreground">
                    {defaultOutputDir || t('settings.noDirectorySelected')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSelectDirectory}
                  className="shrink-0 mt-5 px-3 py-2 text-sm border rounded-md hover:bg-accent"
                >
                  {t('settings.selectDirectory')}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isGenerating}>
              {t('form.reset')}
            </Button>
            <Button type="submit" disabled={isGenerating || !form.formState.isValid}>
              {isGenerating ? t('document.generating') : t('form.generate')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
