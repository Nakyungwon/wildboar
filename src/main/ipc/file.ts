import { app, ipcMain } from 'electron'
import type { IpcChannels } from '../../shared/types/ipc'
import { saveDialog, openFolder, selectDirectory } from '../services/fileService'

export function registerFileHandlers(): void {
  // file:save-dialog - Opens save dialog, returns path
  ipcMain.handle(
    'file:save-dialog',
    async (
      _event,
      request: IpcChannels['file:save-dialog']['request']
    ): Promise<IpcChannels['file:save-dialog']['response']> => {
      try {
        return await saveDialog(request.defaultName, request.filters, request.defaultPath)
      } catch (error) {
        console.error('Error in file:save-dialog:', error)
        return { canceled: true }
      }
    }
  )

  // file:open-folder - Opens folder in system file manager
  ipcMain.handle(
    'file:open-folder',
    async (
      _event,
      request: IpcChannels['file:open-folder']['request']
    ): Promise<IpcChannels['file:open-folder']['response']> => {
      try {
        await openFolder(request.path)
      } catch (error) {
        console.error('Error in file:open-folder:', error)
        throw error
      }
    }
  )

  // file:select-directory - Opens directory selection dialog
  ipcMain.handle(
    'file:select-directory',
    async (
      _event,
      request: IpcChannels['file:select-directory']['request']
    ): Promise<IpcChannels['file:select-directory']['response']> => {
      try {
        return await selectDirectory(request?.defaultPath)
      } catch (error) {
        console.error('Error in file:select-directory:', error)
        return { canceled: true }
      }
    }
  )

  // file:get-documents-dir - Returns the user's Documents folder (cross-platform)
  ipcMain.handle(
    'file:get-documents-dir',
    async (): Promise<IpcChannels['file:get-documents-dir']['response']> => {
      try {
        return { path: app.getPath('documents') }
      } catch (error) {
        console.error('Error in file:get-documents-dir:', error)
        return { path: app.getPath('home') }
      }
    }
  )
}
