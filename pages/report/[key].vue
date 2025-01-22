<template>
  <div>
    <template v-if="!appStore.windowWidth || appStore.windowWidth > 1400">
      <ReportDesktop/>
    </template>
    <template v-if="appStore.windowWidth <= 1400">
      <ReportMobile/>
    </template>
  </div>
</template>

<script lang="ts">
import ReportDesktop from "~/pages/report/ReportDesktop.vue";
import ReportMobile from "~/pages/report/ReportMobile.vue";
import { mapStores } from "pinia";


export default defineComponent({
  name: "Report",
  middleware: ['checkSourceId'],
  components: { ReportDesktop, ReportMobile },
  computed: {
    ...mapStores( useAppStore )
  },

  methods: {
    setHead() {
      useHead({
        title: 'Форма обратной связь | Кипиш - Медиа ресурс о светской',
        meta: [
          { name: 'description', content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.' },
          { name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения' },
          { property: 'og:title', content: 'Афиша мероприятий в Бишкеке: концерты, вечеринки, фестивали | Кипиш' },
          { property: 'og:description', content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.' },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: 'https://kipish.kg/' },
          { property: 'og:image', content: 'https://www.kipish.kg/logo-white.png' }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
          { rel: 'canonical', href: 'https://kipish.kg/reports/' },
        ],
      })
    },
  },

  mounted() {
    this.setHead();
  },
});
</script>
