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
        // Register from HTML instead of the JS bundle so scanners
        // (PWABuilder/Lighthouse) detect the SW before the app hydrates.
        injectRegister: false,
        includeAssets: [
          'icons/logo.png',
          'favicon.ico',
          'apple-touch-icon-180x180.png',
          'pwa-*.png',
          'maskable-icon-*.png',
          'screenshots/*.png',
        ],
        pwaAssets: {
          config: true,
          includeHtmlHeadLinks: true,
          injectThemeColor: true,
        },
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
              src: `${base}pwa-64x64.png`,
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: `${base}pwa-192x192.png`,
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: `${base}pwa-512x512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: `${base}maskable-icon-512x512.png`,
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
          globPatterns: ['**/*.{js,css,html,ico,svg,png,woff2,webmanifest}'],
          navigateFallback: 'index.html',
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 64,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: ({ request }) =>
                request.destination === 'style' ||
                request.destination === 'script' ||
                request.destination === 'worker',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'assets',
              },
            },
          ],
        },
      }),
    ],
  }
})
