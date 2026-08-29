import {
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: {
    ...minimal2023Preset,
    // Keep artwork readable; icon already has rounded corners.
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, 'favicon.ico']],
      padding: 0,
    },
    maskable: {
      sizes: [512],
      padding: 0.1,
      resizeOptions: {
        background: '#059669',
        fit: 'contain',
      },
    },
    apple: {
      sizes: [180],
      padding: 0.1,
      resizeOptions: {
        background: '#ffffff',
        fit: 'contain',
      },
    },
    png: {
      compressionLevel: 9,
      quality: 85,
    },
  },
  images: ['public/pwa-icon.png'],
})
