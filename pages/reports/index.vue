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

  // head() {
  //   return {
  //     title: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш',
  //     meta: [
  //       {
  //         hid: 'description',
  //         name: 'description',
  //         content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!'
  //       },
  //       {
  //         hid: 'keywords',
  //         name: 'keywords',
  //         content: 'бар, Бишкек, отдых, напитки, развлечения'
  //       },
  //       {
  //         hid: 'og:title',
  //         property: 'og:title',
  //         content: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш'
  //       },
  //       {
  //         hid: 'og:description',
  //         property: 'og:description',
  //         content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!'
  //       },
  //       {
  //         hid: 'og:type',
  //         property: 'og:type',
  //         content: 'website'
  //       },
  //       {
  //         hid: 'og:url',
  //         property: 'og:url',
  //         content: 'https://kipish.kg/'
  //       }
  //     ],
  //     link: [
  //       { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' }
  //     ]
  //   };
  // },

  methods: {
    setHead() {
      useHead({
        title: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш',
        meta: [
          { name: 'description', content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!' },
          { name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения' },
          { property: 'og:title', content: 'Фото отчеты: лучшие события и заведения Бишкека | Кипиш' },
          { property: 'og:description', content: 'Смотрите фото отчеты с лучших событий и заведений Бишкека на Кипише. Узнайте, как проходят яркие мероприятия города, и не пропустите ни одного значимого события!' },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: 'https://kipish.kg/' },
          { property: 'og:image', content: 'http://kipish.kg/images/logo-white.svg' },
          { property: 'og:image:width', content: '53' },
          { property: 'og:image:height', content: '54' },
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
          { rel: 'canonical', href: 'https://kipish.kg/reports/' },
        ],
        script: [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://kipish.kg/" },
                { "@type": "ListItem", "position": 2, "name": "Репортажи", "item": "https://kipish.kg/reports" }
              ]
            }),
          }
        ]
      })
    },
  },

  mounted() {
    this.setHead();
  },
});
</script>

<style lang="scss">

</style>
