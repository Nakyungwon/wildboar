import { resolve, normalize } from 'path'
import { app } from 'electron'

/**
 * Validate that a file path is within allowed directories
 * Prevents path traversal attacks
 */
export function isPathSafe(filePath: string): boolean {
  try {
    const normalizedPath = normalize(resolve(filePath))
    const allowedDirs = [
      app.getPath('home'),
      app.getPath('documents'),
      app.getPath('downloads'),
      app.getPath('desktop'),
      app.getPath('userData')
    ]

    return allowedDirs.some((dir) => {
      const normalizedDir = normalize(resolve(dir))
      return normalizedPath.startsWith(normalizedDir)
    })
  } catch {
    return false
  }
}

/**
 * Sanitize file name for cross-platform compatibility
 * Removes or replaces invalid characters
 */
export function sanitizeFileName(fileName: string): string {
  // Remove or replace invalid characters for Windows/macOS/Linux
  const invalidChars = /[<>:"/\\|?*\x00-\x1F]/g
  const sanitized = fileName.replace(invalidChars, '_')

  // Remove leading/trailing spaces and dots
  const trimmed = sanitized.trim().replace(/^\.+/, '').replace(/\.+$/, '')

  // Ensure not empty
  if (!trimmed) {
    return 'untitled'
  }

  // Limit length (255 is common max for most filesystems)
  const maxLength = 255
  if (trimmed.length > maxLength) {
    const ext = trimmed.lastIndexOf('.')
    if (ext > 0 && ext > maxLength - 10) {
      const extension = trimmed.substring(ext)
      const name = trimmed.substring(0, maxLength - extension.length)
      return name + extension
    }
    return trimmed.substring(0, maxLength)
  }

  return trimmed
}
