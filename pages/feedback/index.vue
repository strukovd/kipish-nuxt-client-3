<template>
  <div>
    <template v-if="!$device.isMobile">
      <FeedbackDesktop/>
    </template>
    <template v-else>
      <FeedbackMobile/>
    </template>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import FeedbackDesktop from "./FeedbackDesktop.vue";
import FeedbackMobile from "./FeedbackMobile.vue";

export default {
  name: "Feedback",
  components: { FeedbackDesktop, FeedbackMobile },

  methods: {
    setHead() {
      useHead({
        title: 'Форма обратной связь | Кипиш - Медиа ресурс о светской',
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.'
          },
          {
            hid: 'keywords',
            name: 'keywords',
            content: 'бар, Бишкек, отдых, напитки, развлечения'
          },
          {
            hid: 'og:title',
            property: 'og:title',
            content: 'Афиша мероприятий в Бишкеке: концерты, вечеринки, фестивали | Кипиш'
          },
          {
            hid: 'og:description',
            property: 'og:description',
            content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.'
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
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
          { rel: 'canonical', href: 'https://kipish.kg/feedback/' },
        ],
        script: [
          {
            type: 'application/ld+json',
            json: {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://kipish.kg/" },
                { "@type": "ListItem", "position": 2, "name": "Обратная связь", "item": "https://kipish.kg/feedback" }
              ]
            }
          }
        ]
      })
    },
  },

  mounted() {
    this.setHead();
  },

  computed: {
    ...mapStores( useAppStore ),
  },
}
</script>
