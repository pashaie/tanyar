import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const base = mode === 'production' ? '/tanyar/' : '/'

  return {
    base,
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'icons/logo.png',
          'icons/*.png',
          'screenshots/*.png',
        ],
        manifest: {
          id: 'tanyar',
          name: 'تَن‌یار',
          short_name: 'TanYar',
          description:
            'تَن‌یار یک ردیاب تمرین ورزشی فارسی است: برنامه هفتگی، عادات روزانه، تایمر تمرین و تاریخچه — آفلاین و بدون نیاز به حساب کاربری.',
          lang: 'fa',
          dir: 'rtl',
          theme_color: '#059669',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          categories: ['health', 'fitness', 'lifestyle'],
          start_url: base,
          icons: [
            {
              src: `${base}icons/logo.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: `${base}icons/logo.png`,
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: `${base}icons/logo.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          screenshots: [
            {
              src: `${base}screenshots/dashboard-mobile.png`,
              sizes: '1024x1536',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'داشبورد امروز — عادات و تمرین‌های روزانه',
            },
            {
              src: `${base}screenshots/workout-mobile.png`,
              sizes: '1024x1536',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'تایمر تمرین — ثبت دو، پیاده‌روی و دوچرخه',
            },
            {
              src: `${base}screenshots/plan-wide.png`,
              sizes: '1536x1024',
              type: 'image/png',
              form_factor: 'wide',
              label: 'برنامه هفتگی — برنامه‌ریزی تمرین برای هر روز',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,svg,png,woff2}'],
        },
      }),
    ],
  }
})
