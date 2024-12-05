import heroicon from '~/components/global/heroicon.vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('heroicon', heroicon);
});

