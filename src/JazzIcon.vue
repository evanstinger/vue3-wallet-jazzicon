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

// Mersenne Twister implementation to match original JazzIcon
class MersenneTwister {
  private mt: number[] = new Array(624)
  private mti: number = 625

  constructor(seed?: number) {
    if (seed === undefined) {
      seed = new Date().getTime()
    }
    this.init_genrand(seed)
  }

  private init_genrand(s: number): void {
    this.mt[0] = s >>> 0
    for (this.mti = 1; this.mti < 624; this.mti++) {
      s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30)
      this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti
      this.mt[this.mti] >>>= 0
    }
  }

  random(): number {
    let y: number
    const mag01 = [0x0, 0x9908b0df]

    if (this.mti >= 624) {
      let kk: number

      if (this.mti === 625) {
        this.init_genrand(5489)
      }

      for (kk = 0; kk < 227; kk++) {
        y = (this.mt[kk] & 0x80000000) | (this.mt[kk + 1] & 0x7fffffff)
        this.mt[kk] = this.mt[kk + 397] ^ (y >>> 1) ^ mag01[y & 0x1]
      }
      for (; kk < 623; kk++) {
        y = (this.mt[kk] & 0x80000000) | (this.mt[kk + 1] & 0x7fffffff)
        this.mt[kk] = this.mt[kk - 227] ^ (y >>> 1) ^ mag01[y & 0x1]
      }
      y = (this.mt[623] & 0x80000000) | (this.mt[0] & 0x7fffffff)
      this.mt[623] = this.mt[396] ^ (y >>> 1) ^ mag01[y & 0x1]

      this.mti = 0
    }

    y = this.mt[this.mti++]

    y ^= y >>> 11
    y ^= (y << 7) & 0x9d2c5680
    y ^= (y << 15) & 0xefc60000
    y ^= y >>> 18

    return (y >>> 0) * (1.0 / 4294967296.0)
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
  borderRadius: '50px',
  overflow: 'hidden',
  display: 'inline-block',
  padding: '0px',
  margin: '0px'
}))

function hueShift(colors: string[], generator: MersenneTwister): string[] {
  const wobble = 30
  const amount = generator.random() * 30 - wobble / 2
  return colors.map(hex => rotateHue(hex, amount))
}

function genColor(colors: string[], generator: MersenneTwister): string {
  const rand = generator.random()
  const idx = Math.floor(colors.length * generator.random())
  return colors.splice(idx, 1)[0]
}

function generateIdenticon(diameter: number, seed: number): HTMLElement {
  const generator = new MersenneTwister(seed)
  const remainingColors = hueShift([...props.colors], generator)
  
  const container = document.createElement('div')
  container.style.borderRadius = '50px'
  container.style.overflow = 'hidden'
  container.style.padding = '0px'
  container.style.margin = '0px'
  container.style.width = `${diameter}px`
  container.style.height = `${diameter}px`
  container.style.display = 'inline-block'
  container.style.background = genColor(remainingColors, generator)
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttributeNS(null, 'x', '0')
  svg.setAttributeNS(null, 'y', '0')
  svg.setAttributeNS(null, 'width', diameter.toString())
  svg.setAttributeNS(null, 'height', diameter.toString())
  
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
  generator: MersenneTwister
): void {
  const center = diameter / 2
  const shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  
  shape.setAttributeNS(null, 'x', '0')
  shape.setAttributeNS(null, 'y', '0')
  shape.setAttributeNS(null, 'width', diameter.toString())
  shape.setAttributeNS(null, 'height', diameter.toString())
  
  const firstRot = generator.random()
  const angle = Math.PI * 2 * firstRot
  const velocity = diameter / total * generator.random() + (i * diameter / total)
  
  const tx = Math.cos(angle) * velocity
  const ty = Math.sin(angle) * velocity
  
  const translate = `translate(${tx} ${ty})`
  
  const secondRot = generator.random()
  const rot = firstRot * 360 + secondRot * 180
  const rotate = `rotate(${rot.toFixed(1)} ${center} ${center})`
  const transform = `${translate} ${rotate}`
  
  shape.setAttributeNS(null, 'transform', transform)
  const fill = genColor(remainingColors, generator)
  shape.setAttributeNS(null, 'fill', fill)
  
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