# Vue3 Wallet JazzIcon

A modern Vue 3 component for generating beautiful, deterministic wallet address identicons (jazzy icons ala Metamask). 

## Features

- 🎨 **Beautiful identicons** - Generate colorful, unique icons from wallet addresses or seeds
- 🔧 **Modern Vue 3** - Built with Composition API and TypeScript
- 📦 **Zero dependencies** - No external libraries required
- 🎯 **Deterministic** - Same input always generates the same icon
- 🎨 **Customizable** - Adjust size, colors, and shape count
- 📱 **Responsive** - Works on all screen sizes
- 🚀 **Lightweight** - Minimal bundle size

## Installation

```bash
# npm
npm install @evanstinger/vue3-wallet-jazzicon

# yarn
yarn add @evanstinger/vue3-wallet-jazzicon

# pnpm
pnpm add @evanstinger/vue3-wallet-jazzicon
```

## Usage

### Global Registration

```typescript
import { createApp } from 'vue'
import JazzIcon from '@evanstinger/vue3-wallet-jazzicon'
import App from './App.vue'

const app = createApp(App)
app.use(JazzIcon)
app.mount('#app')
```

### Local Registration

```vue
<template>
  <div>
    <JazzIcon :address="walletAddress" :diameter="100" />
  </div>
</template>

<script setup lang="ts">
import { JazzIcon } from '@evanstinger/vue3-wallet-jazzicon'

const walletAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF'
</script>
```

### Direct Import

```vue
<template>
  <JazzIcon 
    :address="address" 
    :diameter="150" 
    :shape-count="5" 
  />
</template>

<script setup lang="ts">
import JazzIcon from '@evanstinger/vue3-wallet-jazzicon/src/JazzIcon.vue'

const address = '0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF'
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `address` | `string` | `''` | Wallet address to generate icon from (takes priority over seed) |
| `seed` | `number` | `random` | Numeric seed for icon generation |
| `diameter` | `number` | `100` | Size of the icon in pixels |
| `shapeCount` | `number` | `4` | Number of shapes to generate (2-8 recommended) |
| `colors` | `string[]` | `[default palette]` | Array of hex colors to use for generation |

### Default Color Palette

```typescript
[
  '#01888C', // teal
  '#FC7500', // bright orange
  '#034F5D', // dark teal
  '#F73F01', // orangered
  '#FC1960', // magenta
  '#C7144C', // raspberry
  '#F3C100', // goldenrod
  '#1598F2', // lightning blue
  '#2465E1', // sail blue
  '#F19E02'  // gold
]
```

## Examples

### Basic Usage

```vue
<template>
  <!-- Generate from wallet address -->
  <JazzIcon address="0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF" />
  
  <!-- Generate from numeric seed -->
  <JazzIcon :seed="12345" />
  
  <!-- Custom size -->
  <JazzIcon :address="address" :diameter="200" />
</template>
```

### Advanced Customization

```vue
<template>
  <JazzIcon 
    :address="address"
    :diameter="150"
    :shape-count="6"
    :colors="customColors"
  />
</template>

<script setup lang="ts">
const address = '0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF'
const customColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', 
  '#96CEB4', '#FFEAA7', '#DDA0DD'
]
</script>
```

### Responsive Sizes

```vue
<template>
  <div class="avatar-sizes">
    <JazzIcon :address="address" :diameter="32" />  <!-- Small -->
    <JazzIcon :address="address" :diameter="64" />  <!-- Medium -->
    <JazzIcon :address="address" :diameter="128" /> <!-- Large -->
  </div>
</template>
```

## TypeScript Support

The component is built with TypeScript and includes full type definitions:

```typescript
import type { JazzIconProps } from '@evanstinger/vue3-wallet-jazzicon'

interface JazzIconProps {
  seed?: number
  diameter?: number
  address?: string
  shapeCount?: number
  colors?: string[]
}
```

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- All modern browsers with ES2020 support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

Inspired by the original JazzIcon concept, Metamask and the Ethereum community's need for beautiful wallet identicons.