// https://nuxt.com/docs/api/configuration/nuxt-config
// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  css: [ "vuetify/styles/main.sass" ],
  build: {
    transpile: ['vuetify'],
  },
});
