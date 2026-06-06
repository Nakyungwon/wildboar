import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { cn } from '@renderer/lib/utils'

interface GenerationProgressProps {
  status: 'idle' | 'generating' | 'success' | 'error'
  message?: string
  onRetry?: () => void
  onReset?: () => void
  onOpenFile?: () => void
}

export function GenerationProgress({
  status,
  message,
  onRetry,
  onReset,
  onOpenFile
}: GenerationProgressProps) {
  const { t } = useTranslation()

  const renderContent = () => {
    switch (status) {
      case 'generating':
        return (
          <>
            <div className="flex items-center justify-center py-8">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {message || t('document.generating')}
            </p>
          </>
        )

      case 'success':
        return (
          <>
            <div className="flex items-center justify-center py-8">
              <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl">
                ✓
              </div>
            </div>
            <p className="text-center text-sm font-medium">{message || t('document.success')}</p>
          </>
        )

      case 'error':
        return (
          <>
            <div className="flex items-center justify-center py-8">
              <div className="h-12 w-12 rounded-full bg-destructive flex items-center justify-center text-white text-2xl">
                ✕
              </div>
            </div>
            <p className="text-center text-sm font-medium text-destructive">
              {message || t('document.error')}
            </p>
          </>
        )

      default:
        return null
    }
  }

  const renderActions = () => {
    if (status === 'success' && (onOpenFile || onReset)) {
      return (
        <CardFooter className="flex justify-center gap-2">
          {onOpenFile && <Button onClick={onOpenFile}>{t('common.openFolder')}</Button>}
          {onReset && (
            <Button onClick={onReset} variant={'outline' as const}>
              {t('document.createAnother')}
            </Button>
          )}
        </CardFooter>
      )
    }

    if (status === 'error' && (onRetry || onReset)) {
      return (
        <CardFooter className="flex justify-center gap-2">
          {onRetry && <Button onClick={onRetry}>{t('document.retry')}</Button>}
          {onReset && (
            <Button onClick={onReset} variant={'outline' as const}>
              {t('common.cancel')}
            </Button>
          )}
        </CardFooter>
      )
    }

    return null
  }

  if (status === 'idle') {
    return null
  }

  return (
    <Card className={cn('transition-all', status === 'error' && 'border-destructive')}>
      <CardHeader>
        <CardTitle>{t('document.generation')}</CardTitle>
        <CardDescription>
          {status === 'generating' && t('document.generatingDesc')}
          {status === 'success' && t('document.successDesc')}
          {status === 'error' && t('document.errorDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
      {renderActions()}
    </Card>
  )
}
