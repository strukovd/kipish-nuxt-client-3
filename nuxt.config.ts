// https://nuxt.com/docs/api/configuration/nuxt-config
// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg', },
      ],
      meta: [
        { name: 'og:image', content: 'https://kipish.kg/favicon.svg' },
        { name: 'og:image:alt', content: 'Kipish.kg - Медиа ресурс о светской и ночной жизни в Бишкеке' },
        { name: 'og:image:width', content: '60' },
        { name: 'og:image:height', content: '56' },
      ]
    },
  },

  nitro: {
    routeRules: {
      '/**': { prerender: false },
    },
  },

  modules: ['@pinia/nuxt', 'nuxt-aos', 'vue-yandex-maps/nuxt'],
  yandexMaps: {
    apikey: '62c88456-1fdb-474c-8ed3-a45218e508ca',
  },
  plugins: [
    '~/plugins/global-components',
    '~/plugins/http',
    '~/plugins/http2',
    '~/plugins/vuetify',
  ],

  css: [
    "vue-yandex-maps/dist/vue-yandex-maps.css",
    "vuetify/styles/main.sass"
  ],
  build: {
    transpile: ['vuetify'],
  },
});
