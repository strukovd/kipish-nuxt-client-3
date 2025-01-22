<template>
  <div>
    <template v-if="!appStore.windowWidth || appStore.windowWidth > 1400">
      <VideosDesktop/>
    </template>
    <template v-if="appStore.windowWidth <= 1400">
      <VideosMobile/>
    </template>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import VideosDesktop from "./VideosDesktop.vue";
import VideosMobile from "./VideosMobile.vue";


export default defineComponent({
  components: { VideosDesktop, VideosMobile },
  computed: {
    ...mapStores( useAppStore ),
  },

  methods: {
    setHead() {
      useHead({
        title: 'Видео отчеты и репортажи о событиях в Бишкеке | Кипиш',
        meta: [
          { name: 'description', content: 'Смотрите эксклюзивные видео отчеты с лучших событий и заведений Бишкека на Кипише. Погружайтесь в атмосферу светской и ночной жизни города вместе с нами.' },
          { name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения' },
          { property: 'og:title', content: 'Видео отчеты и репортажи о событиях в Бишкеке | Кипиш' },
          { property: 'og:description', content: 'Смотрите эксклюзивные видео отчеты с лучших событий и заведений Бишкека на Кипише. Погружайтесь в атмосферу светской и ночной жизни города вместе с нами.' },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: 'https://kipish.kg/' },
          { property: 'og:image', content: 'https://www.kipish.kg/logo-white.png' },
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
  }
});
</script>
