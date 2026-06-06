import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useSettingsStore } from '../../stores/settingsStore'

export function OutputDirectorySettings(): JSX.Element {
  const { t } = useTranslation()
  const { defaultOutputDir, setDefaultOutputDir } = useSettingsStore()

  const handleSelectDirectory = async () => {
    const result = await window.api.selectDirectory({
      defaultPath: defaultOutputDir || undefined
    })

    if (!result.canceled && result.path) {
      setDefaultOutputDir(result.path)
    }
  }

  const handleClearDirectory = () => {
    setDefaultOutputDir('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.outputDirectory')}</CardTitle>
        <CardDescription>{t('settings.outputDirectoryDesc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <div className="px-3 py-2 bg-muted rounded-md text-sm truncate">
                {defaultOutputDir || t('settings.noDirectorySelected')}
              </div>
            </div>
            <Button onClick={handleSelectDirectory} variant="outline" size="sm">
              {t('settings.selectDirectory')}
            </Button>
            {defaultOutputDir && (
              <Button onClick={handleClearDirectory} variant="ghost" size="sm">
                {t('settings.clearDirectory')}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{t('settings.outputDirectoryHint')}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default OutputDirectorySettings
