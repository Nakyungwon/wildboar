import * as React from 'react'
import { Controller, Control, FieldError } from 'react-hook-form'
import type { FormField as FormFieldType } from '../../../../shared/types/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Checkbox } from '../ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { cn } from '@renderer/lib/utils'

interface FormFieldProps {
  field: FormFieldType
  control: Control<any>
  error?: FieldError
}

export function FormField({ field, control, error }: FormFieldProps) {
  const renderInput = (value: any, onChange: (value: any) => void): React.ReactElement => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn(error && 'border-destructive')}
          />
        )

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.valueAsNumber)}
            min={field.validation?.min}
            max={field.validation?.max}
            className={cn(error && 'border-destructive')}
          />
        )

      case 'date':
        return (
          <Input
            type="date"
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn(error && 'border-destructive')}
          />
        )

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={cn(error && 'border-destructive')}
          />
        )

      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className={cn(error && 'border-destructive')}>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!value}
              onCheckedChange={onChange}
              className={cn(error && 'border-destructive')}
            />
            <Label className="text-sm font-normal">{field.label}</Label>
          </div>
        )

      default:
        return <div>Unsupported field type</div>
    }
  }

  return (
    <div className="space-y-2">
      {field.type !== 'checkbox' && (
        <Label htmlFor={field.id}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}

      <Controller
        name={field.id}
        control={control}
        defaultValue={field.defaultValue}
        rules={{
          required: field.required ? `${field.label} is required` : false,
          minLength: field.validation?.minLength
            ? {
                value: field.validation.minLength,
                message: `Minimum length is ${field.validation.minLength}`
              }
            : undefined,
          maxLength: field.validation?.maxLength
            ? {
                value: field.validation.maxLength,
                message: `Maximum length is ${field.validation.maxLength}`
              }
            : undefined,
          min: field.validation?.min
            ? {
                value: field.validation.min,
                message: `Minimum value is ${field.validation.min}`
              }
            : undefined,
          max: field.validation?.max
            ? {
                value: field.validation.max,
                message: `Maximum value is ${field.validation.max}`
              }
            : undefined,
          pattern: field.validation?.pattern
            ? {
                value: new RegExp(field.validation.pattern),
                message: 'Invalid format'
              }
            : undefined
        }}
        render={({ field: { value, onChange } }) => renderInput(value, onChange)}
      />

      {error && <p className="text-sm font-medium text-destructive">{error.message}</p>}
    </div>
  )
}
