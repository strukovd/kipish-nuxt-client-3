// https://nuxt.com/docs/api/configuration/nuxt-config
// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', 'nuxt-aos'],

  css: [ "vuetify/styles/main.sass" ],
  build: {
    transpile: ['vuetify'],
  },
});
