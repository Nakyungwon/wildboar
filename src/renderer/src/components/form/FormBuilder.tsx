import { useEffect } from 'react'
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
  const { defaultOutputDir, setDefaultOutputDir, outputFilePath, setOutputFilePath } =
    useSettingsStore()

  // Open the save dialog up front: the user names the file and picks the location,
  // and we keep the full path so generation can write to it immediately.
  const handleSelectOutputFile = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const rawTitle = (form.getValues('title') as string) || schema.name || 'document'
      const safeName = rawTitle.replace(/[\\/:*?"<>|]/g, '_').trim() || 'document'

      const result = await window.api.saveDialog({
        defaultName: `${safeName}.hwpx`,
        filters: [{ name: t('document.hwpx'), extensions: ['hwpx'] }],
        defaultPath: defaultOutputDir || undefined
      })

      if (!result.canceled && result.filePath) {
        setOutputFilePath(result.filePath)
        const sep = Math.max(result.filePath.lastIndexOf('/'), result.filePath.lastIndexOf('\\'))
        if (sep > 0) setDefaultOutputDir(result.filePath.substring(0, sep))
      }
    } catch (error) {
      console.error('Error selecting output file:', error)
    }
  }

  // Auto-save form data
  useAutoSave(form.watch(), isReady)

  // On first load, pre-fill a sensible default output path:
  //   <last-used dir | OS Documents folder>/<schema name>_<YYYY-MM-DD>.hwpx
  // The user can still change it via the "변경" button before generating.
  useEffect(() => {
    if (outputFilePath) return
    let cancelled = false
    ;(async () => {
      try {
        const dir = defaultOutputDir || (await window.api.getDocumentsDir()).path
        if (cancelled || !dir) return
        const sep = dir.includes('\\') ? '\\' : '/'
        const base = (schema.name || 'document').replace(/[\\/:*?"<>|]/g, '_').trim() || 'document'
        const now = new Date()
        const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
          now.getDate()
        ).padStart(2, '0')}`
        const fileName = `${base}_${stamp}.hwpx`
        const full = dir.endsWith(sep) ? `${dir}${fileName}` : `${dir}${sep}${fileName}`
        if (!cancelled) setOutputFilePath(full)
      } catch (error) {
        console.error('Failed to initialize default output path:', error)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [outputFilePath, defaultOutputDir, schema.name, setOutputFilePath])

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
        <Card className="flex flex-1 flex-col rounded-none border-0 shadow-none">
          <CardHeader>
            <CardTitle>{schema.name}</CardTitle>
            {schema.description && <CardDescription>{schema.description}</CardDescription>}
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-hidden">
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
                  <label className="text-sm font-medium">{t('settings.outputFile')}</label>
                  <div
                    title={outputFilePath || undefined}
                    className="mt-1 px-3 py-2 bg-muted rounded-md text-sm break-all text-muted-foreground"
                  >
                    {outputFilePath || t('settings.noFileSelected')}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSelectOutputFile}
                  className="shrink-0 mt-5 px-3 py-2 text-sm border rounded-md hover:bg-accent"
                >
                  {outputFilePath ? t('settings.changeFile') : t('settings.selectFile')}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleReset} disabled={isGenerating}>
              {t('form.reset')}
            </Button>
            <Button
              type="submit"
              disabled={isGenerating || !form.formState.isValid || !outputFilePath}
              title={!outputFilePath ? t('settings.noFileSelected') : undefined}
            >
              {isGenerating ? t('document.generating') : t('form.generate')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  )
}
