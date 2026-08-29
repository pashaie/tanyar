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
          id: base,
          name: 'تَن‌یار',
          short_name: 'TanYar',
          description:
            'تَن‌یار یک ردیاب تمرین ورزشی فارسی است: برنامه هفتگی، عادات روزانه، تایمر تمرین و تاریخچه — آفلاین و بدون نیاز به حساب کاربری.',
          lang: 'fa',
          dir: 'rtl',
          theme_color: '#059669',
          background_color: '#ffffff',
          display: 'standalone',
          display_override: ['window-controls-overlay', 'standalone', 'browser'],
          orientation: 'portrait-primary',
          categories: ['health', 'fitness', 'lifestyle'],
          start_url: base,
          scope: base,
          handle_links: 'preferred',
          launch_handler: {
            client_mode: 'focus-existing',
          },
          prefer_related_applications: false,
          related_applications: [],
          edge_side_panel: {
            preferred_width: 400,
          },
          protocol_handlers: [
            {
              protocol: 'web+tanyar',
              url: `${base}?protocol=%s`,
            },
          ],
          share_target: {
            action: `${base}settings`,
            method: 'GET',
            params: {
              title: 'title',
              text: 'text',
              url: 'url',
            },
          },
          file_handlers: [
            {
              action: `${base}settings`,
              accept: {
                'application/json': ['.json'],
              },
            },
          ],
          icons: [
            {
              src: `${base}pwa-64x64.png`,
              sizes: '64x64',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: `${base}pwa-192x192.png`,
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
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
          shortcuts: [
            {
              name: 'شروع تمرین',
              short_name: 'تمرین',
              description: 'باز کردن تایمر تمرین',
              url: `${base}workout`,
              icons: [
                {
                  src: `${base}pwa-96x96.png`,
                  sizes: '96x96',
                  type: 'image/png',
                },
              ],
            },
            {
              name: 'برنامه هفتگی',
              short_name: 'برنامه',
              description: 'مشاهده و ویرایش برنامه هفته',
              url: `${base}plan`,
              icons: [
                {
                  src: `${base}pwa-96x96.png`,
                  sizes: '96x96',
                  type: 'image/png',
                },
              ],
            },
            {
              name: 'عادات روزانه',
              short_name: 'عادات',
              description: 'مدیریت عادات روزانه',
              url: `${base}habits`,
              icons: [
                {
                  src: `${base}pwa-96x96.png`,
                  sizes: '96x96',
                  type: 'image/png',
                },
              ],
            },
            {
              name: 'تنظیمات',
              short_name: 'تنظیمات',
              description: 'پشتیبان‌گیری و تنظیمات',
              url: `${base}settings`,
              icons: [
                {
                  src: `${base}pwa-96x96.png`,
                  sizes: '96x96',
                  type: 'image/png',
                },
              ],
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
