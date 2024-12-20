<template>
  <section class="poster-section mid" data-aos="fade-up" data-aos-duration="1500">
    <h1 class="h1-font" style="z-index: 999; font-size:68px; line-height:1.2em; position:relative;"><span>Медиа ресурс о светской</span><br><span>жизни</span></h1>
    <div style="position:relative; height:500px; margin-top:-78px;">
      <div v-if="!loading" data-aos="fade-up" data-aos-duration="500" style="position: relative;border-radius: 20px 0 0 20px; height: 500px; overflow: hidden;">
        <BasePosterSlider :posters="posters"/>
      </div>
    </div>
  </section>
  <section class="marquee-section" data-aos="fade-up" data-aos-duration="1500">
    <ClientOnly>
      <Marquee text="Стиль / Люди / События /"/>
    </ClientOnly>
  </section>
  <section class="ad-section mid" data-aos="fade-up" data-aos-duration="1500">
    <ClientOnly>
      <BaseAd :loading="loading"/>
    </ClientOnly>
  </section>
  <section class="reports-section mid" data-aos="fade-up" data-aos-duration="1500">
    <DesktopReports/>
  </section>
  <section class="videos-section" data-aos="fade-up" data-aos-duration="1500">
    <DesktopVideos/>
  </section>
  <section class="establishments-section mid" data-aos="fade-up" data-aos-duration="1500">
    <DesktopEstabs/>
  </section>
  <section class="ad-section mid" data-aos="fade-up" data-aos-duration="1500">
    <ClientOnly>
      <BaseAd :loading="loading"/>
    </ClientOnly>
  </section>
  <section class="about-section" data-aos="fade-up" data-aos-duration="1500">
    <!-- <DesktopMedia/> -->
  </section>
  <section class="statistics-section" data-aos="fade-up" data-aos-duration="1500">

  </section>
  <section class="carousel-section" data-aos="fade-up" data-aos-duration="1500">

  </section>
</template>

<script lang="ts">
import { useAppStore } from '@/stores';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import BaseAd from '~/components/common/BaseAd.vue';
import BasePosterSlider from '~/components/common/BasePosterSlider.vue';
import Marquee from '~/components/common/Marquee.vue';
import DesktopEstabs from '~/components/sections/estabsBlock/DesktopEstabs.vue';
import DesktopReports from '~/components/sections/reportsBlock/DesktopReports.vue';
import DesktopVideos from '~/components/sections/videoBlock/DesktopVideos.vue';

export default defineComponent({
  components: { BasePosterSlider, Marquee, BaseAd, DesktopReports, DesktopVideos, DesktopEstabs },
  computed: {
    ...mapStores( useAppStore ),
  },

  data() {
    return {
      loading: true,
      posters: [] as any[],
      defaultPosters: [ // TODO: удалить
        {
          description: '', date: '', imgReserve: true, files: [], isLogo: false, isCover: true,
          title: 'Нет активных мероприятий', file: '/static/images/post-bg-img.png'
        }
      ] as any[],
    };
  },

  methods: {
    async fetchPosters() {
      this.loading = true;

      const params = {
        cityId: this.appStore.currentCity?.id ?? null,
      };
      this.$http2.get('/posters', {params})
        .then((resp)=>{
          if (!resp.data?.content.length) {
            this.posters = this.defaultPosters;
            return;
          }

          this.posters = resp.data.content;
          if(this.posters?.length) {
            // парсим значение поля options
            this.posters.forEach((poster, inx) => {
              if (poster.options) {
                poster.options = JSON.parse(poster.options);
              }
            })
          }
        })
        .catch((error) => {
          console.error('Error fetching posters:', error);
          this.posters = this.defaultPosters;
        })
        .finally(() => {
          setTimeout(() => { this.loading = false; }, 0);
        });
    },
  },

  created() {
    this.fetchPosters();
  }
});
</script>

<style lang="scss">

</style>
