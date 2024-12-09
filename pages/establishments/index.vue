<template>
  <div>
    <template v-if="!appStore.windowWidth || appStore.windowWidth > 1400">
      <EstablishmentsDesktop />
    </template>
    <template v-if="appStore.windowWidth <= 1400">
      <!-- <EstablishmentsMobile /> -->
    </template>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import EstablishmentsDesktop from "./EstablishmentsDesktop.vue";

export default defineComponent({
  components: { EstablishmentsDesktop },
  computed: {
    ...mapStores( useAppStore )
  },
  head() {
    return {
      title: 'Лучшие заведения Бишкека: рестораны, кафе и бары | Кипиш',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Откройте лучшие рестораны Бишкека, уютные кафе, ночные клубы и модные бары. Узнайте больше о топовых заведениях города и выбирайте идеальное место для вашего отдыха на Кипише.'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'бар, Бишкек, отдых, напитки, развлечения'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Лучшие заведения Бишкека: рестораны, кафе и бары | Кипиш'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Откройте лучшие рестораны Бишкека, уютные кафе, ночные клубы и модные бары. Узнайте больше о топовых заведениях города и выбирайте идеальное место для вашего отдыха на Кипише.'
        },
        {
          hid: 'og:type',
          property: 'og:type',
          content: 'website'
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: 'https://kipish.kg/'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
      ]
    };
  }
});
</script>
