<template>
  <div>
    <template v-if="appStore.windowWidth > 1400">
      <ReportsDesktop />
    </template>
    <template v-if="appStore.windowWidth <= 1400">
      <ReportsMobile />
    </template>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import ReportsDesktop from './ReportsDesktop.vue';
import ReportsMobile from './ReportsMobile.vue';


export default defineComponent({
  components: { ReportsDesktop, ReportsMobile },
  computed: {
    ...mapStores( useAppStore ),
  },
  head() {
    return {
      title: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'бар, Бишкек, отдых, напитки, развлечения'
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш'
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!'
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
  },
});
</script>

<style lang="scss">

</style>
