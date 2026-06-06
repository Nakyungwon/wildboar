import { registerFileHandlers } from './file'
import { registerDocumentHandlers } from './document'

export function registerAllHandlers(): void {
  registerFileHandlers()
  registerDocumentHandlers()
}
