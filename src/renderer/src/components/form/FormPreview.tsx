import * as React from 'react'
import type { FormData, FormSchema } from '../../../../shared/types/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'

interface FormPreviewProps {
  schema: FormSchema
  data: FormData
}

export function FormPreview({ schema, data }: FormPreviewProps) {
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return '-'
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }
    if (value instanceof Date) {
      return value.toLocaleDateString()
    }
    return String(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Preview</CardTitle>
        <CardDescription>Review your information before generating the document</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schema.fields.map((field) => (
            <div key={field.id} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0">
              <Label className="font-medium text-muted-foreground">{field.label}</Label>
              <div className="col-span-2 text-sm">{formatValue(data[field.id])}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
