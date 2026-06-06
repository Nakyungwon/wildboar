/// <reference types="vite/client" />

import type { Api } from '../../preload/index.d'

declare global {
  interface Window {
    api: Api
  }
}

export {}
