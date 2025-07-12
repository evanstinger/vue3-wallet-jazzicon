import { createApp, ref } from 'vue'
import JazzIcon from './JazzIcon.vue'

const app = createApp({
  components: {
    'jazz-icon': JazzIcon
  },
  setup() {
    const address = ref('0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF')
    const diameter = ref(100)
    const shapeCount = ref(4)
    const seed = ref(12345)
    const sampleAddresses = ref([
      '0x742d35Cc6634C0532925a3b8D4C9db96590e4CAF',
      '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      '0x8ba1f109551bD432803012645Hac136c',
      '0x1234567890123456789012345678901234567890',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      '0x9876543210987654321098765432109876543210'
    ])

    const generateRandom = () => {
      seed.value = Math.round(Math.random() * 10000000)
    }

    return {
      address,
      diameter,
      shapeCount,
      seed,
      sampleAddresses,
      generateRandom
    }
  }
})

app.mount('#app')