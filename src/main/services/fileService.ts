import { dialog, shell } from 'electron'
import type { FileFilter } from '../../shared/types/ipc'
import { sanitizeFileName, isPathSafe } from '../lib/validation'

/**
 * Show native save dialog
 * @param defaultName - Default file name
 * @param filters - File type filters
 * @param defaultPath - Default directory path (optional)
 * @returns Result with canceled flag and optional file path
 */
export async function saveDialog(
  defaultName: string,
  filters: FileFilter[],
  defaultPath?: string
): Promise<{ canceled: boolean; filePath?: string }> {
  const sanitized = sanitizeFileName(defaultName)
  const fullDefaultPath = defaultPath ? `${defaultPath}/${sanitized}` : sanitized

  const result = await dialog.showSaveDialog({
    defaultPath: fullDefaultPath,
    filters: filters.map((f) => ({
      name: f.name,
      extensions: f.extensions
    })),
    properties: ['createDirectory', 'showOverwriteConfirmation']
  })

  if (result.canceled || !result.filePath) {
    return { canceled: true }
  }

  // Validate path is safe
  if (!isPathSafe(result.filePath)) {
    throw new Error('Selected path is not within allowed directories')
  }

  return {
    canceled: false,
    filePath: result.filePath
  }
}

/**
 * Open folder in system file manager
 * @param path - Path to open
 */
export async function openFolder(path: string): Promise<void> {
  // Validate path is safe
  if (!isPathSafe(path)) {
    throw new Error('Path is not within allowed directories')
  }

  const result = await shell.openPath(path)

  if (result) {
    throw new Error(`Failed to open folder: ${result}`)
  }
}

/**
 * Show native directory selection dialog
 * @param defaultPath - Default directory path (optional)
 * @returns Result with canceled flag and optional path
 */
export async function selectDirectory(
  defaultPath?: string
): Promise<{ canceled: boolean; path?: string }> {
  const result = await dialog.showOpenDialog({
    defaultPath: defaultPath || undefined,
    properties: ['openDirectory', 'createDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true }
  }

  const selectedPath = result.filePaths[0]

  // Validate path is safe
  if (!isPathSafe(selectedPath)) {
    throw new Error('Selected path is not within allowed directories')
  }

  return {
    canceled: false,
    path: selectedPath
  }
}
