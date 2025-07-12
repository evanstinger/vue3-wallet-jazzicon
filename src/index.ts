import type { App } from 'vue'
import JazzIcon from './JazzIcon.vue'

// Export the props interface for TypeScript users
export interface JazzIconProps {
  seed?: number
  diameter?: number
  address?: string
  shapeCount?: number
  colors?: string[]
}

// Export the component
export { JazzIcon }

// Plugin install function
export function install(app: App): void {
  app.component('JazzIcon', JazzIcon)
}

// Auto-install when used via script tag
declare global {
  interface Window {
    Vue?: any
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// Default export for plugin usage - avoid direct component reference
const plugin = {
  install
}

export default plugin