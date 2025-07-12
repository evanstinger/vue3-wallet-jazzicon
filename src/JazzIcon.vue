<template>
  <div ref="jazziconRef" :style="containerStyle" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, type CSSProperties } from 'vue'

interface JazzIconProps {
  seed?: number
  diameter?: number
  address?: string
  shapeCount?: number
  colors?: string[]
}

const props = withDefaults(defineProps<JazzIconProps>(), {
  seed: () => Math.round(Math.random() * 10000000),
  diameter: 100,
  address: '',
  shapeCount: 4,
  colors: () => [
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
})

const jazziconRef = ref<HTMLElement>()

// Simple PRNG implementation to replace mersenne-twister
class SimpleRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed % 2147483647
    if (this.seed <= 0) this.seed += 2147483646
  }

  random(): number {
    this.seed = (this.seed * 16807) % 2147483647
    return (this.seed - 1) / 2147483646
  }
}

// Color manipulation functions to replace color package
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360
  s /= 100
  l /= 100

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }

  const toHex = (c: number): string => {
    const hex = Math.round(c * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function rotateHue(hex: string, degrees: number): string {
  const [h, s, l] = hexToHsl(hex)
  const newH = (h + degrees) % 360
  return hslToHex(newH < 0 ? newH + 360 : newH, s, l)
}

function addressToNumber(address: string): number {
  return parseInt(address.slice(2, 10), 16)
}

const containerStyle = computed((): CSSProperties => ({
  width: `${props.diameter}px`,
  height: `${props.diameter}px`,
  borderRadius: `${props.diameter / 2}px`,
  overflow: 'hidden',
  display: 'inline-block',
  padding: '0',
  margin: '0'
}))

function hueShift(colors: string[], generator: SimpleRandom): string[] {
  const wobble = 30
  const amount = generator.random() * 30 - wobble / 2
  return colors.map(hex => rotateHue(hex, amount))
}

function genColor(colors: string[], generator: SimpleRandom): string {
  const idx = Math.floor(colors.length * generator.random())
  return colors.splice(idx, 1)[0]
}

function generateIdenticon(diameter: number, seed: number): HTMLElement {
  const generator = new SimpleRandom(seed)
  const remainingColors = hueShift([...props.colors], generator)
  
  const container = document.createElement('div')
  container.style.width = `${diameter}px`
  container.style.height = `${diameter}px`
  container.style.background = genColor(remainingColors, generator)
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', diameter.toString())
  svg.setAttribute('height', diameter.toString())
  svg.setAttribute('viewBox', `0 0 ${diameter} ${diameter}`)
  
  container.appendChild(svg)
  
  for (let i = 0; i < props.shapeCount - 1; i++) {
    genShape(remainingColors, diameter, i, props.shapeCount - 1, svg, generator)
  }
  
  return container
}

function genShape(
  remainingColors: string[],
  diameter: number,
  i: number,
  total: number,
  svg: SVGElement,
  generator: SimpleRandom
): void {
  const center = diameter / 2
  const shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  
  shape.setAttribute('x', '0')
  shape.setAttribute('y', '0')
  shape.setAttribute('width', diameter.toString())
  shape.setAttribute('height', diameter.toString())
  
  const firstRot = generator.random()
  const angle = Math.PI * 2 * firstRot
  const velocity = (diameter / total) * generator.random() + (i * diameter) / total
  const tx = Math.cos(angle) * velocity
  const ty = Math.sin(angle) * velocity
  const translate = `translate(${tx} ${ty})`
  
  const secondRot = generator.random()
  const rot = firstRot * 360 + secondRot * 180
  const rotate = `rotate(${rot.toFixed(1)} ${center} ${center})`
  const transform = `${translate} ${rotate}`
  
  shape.setAttribute('transform', transform)
  shape.setAttribute('fill', genColor(remainingColors, generator))
  
  svg.appendChild(shape)
}

function generateIcon(): void {
  if (!jazziconRef.value) return
  
  const seed = props.address ? addressToNumber(props.address) : props.seed
  jazziconRef.value.innerHTML = ''
  const el = generateIdenticon(props.diameter, seed)
  jazziconRef.value.appendChild(el)
}

// Watch for prop changes
watch([() => props.seed, () => props.address, () => props.diameter], generateIcon)

onMounted(generateIcon)
</script>

<style scoped>
/* Component styles are handled via computed containerStyle */
</style>