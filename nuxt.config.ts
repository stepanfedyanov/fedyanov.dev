export default defineNuxtConfig({
  devtools: {enabled: process.env.NODE_ENV !== 'production'},

  compatibilityDate: '2026-05-05',

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0',
      link: [
        {rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96'},
        {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
        {rel: 'shortcut icon', href: '/favicon.ico'},
        {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
        {rel: 'manifest', href: '/site.webmanifest'},
      ],
      meta: [
        {name: 'apple-mobile-web-app-title', content: 'Stepan Fedyanov'},
        {name: 'msapplication-TileColor', content: '#9f00a7'},
        {name: 'theme-color', content: '#ffffff'},
        {name: 'yandex-verification', content: 'ec87491170d98059'},
      ],
    },
  },

  modules: ['@artmizu/yandex-metrika-nuxt', '@nuxtjs/i18n', 'nuxt-gtag', '@nuxtjs/sitemap', '@nuxt/image', '@nuxtjs/supabase'],

  image: {
		provider: 'ipx',
		quality: 40,
		format: ['avif'],
		screens: {
			'xs': 320,
			'sm': 640,
			'lg': 1024,
			'xl': 1280,
			'xxl': 1536,
			'2xl': 1536,
		},
	},

  i18n: {
    strategy: (process.env.NODE_ENV === 'production') ? 'no_prefix' : 'prefix_except_default',
    defaultLocale: 'en',
    differentDomains: (process.env.NODE_ENV === 'production'),
    locales: [
      { code: 'en', name: 'English', file: 'en.json', domain: 'www.fedyanov.dev'},
      { code: 'ru', name: 'Русский', file: 'ru.json', domain: 'www.fedyanov.ru' }
    ],
    detectBrowserLanguage: false,
  },

  routeRules: {
    '/en/**': {redirect: {to: 'https://www.fedyanov.dev', statusCode: 302}},
  },

  yandexMetrika: {
    id: '94567972',
  },

  gtag: {
    id: 'G-9SZEZ9GY23'
  },

  supabase: {
    redirect: false,
    cookieOptions: {
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
    },
  },
  
  css: ['normalize.css'],
});
