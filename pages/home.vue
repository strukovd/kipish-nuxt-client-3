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
  <section class="about-section mid" data-aos="fade-up" data-aos-duration="1500">
    <div style="display:flex; gap:1em;">
      <section style="flex:40% 0 1; text-align:left; color:#444444; display:flex; flex-direction:column; justify-content:space-between;">
        <h2 class="h1-font" style="z-index: 999; font-size:82px; line-height:1.2em; position:relative;"><span style="padding-left:1em;">Кипишуй</span><br><span>с нами</span></h2>
        <p class="font-text" style="font-weight:300; font-size:24px;">Медиа ресурс о светской, вечерней и ночной жизни города Место, куда заходят чтобы почувствовать и быть в курсе всех событий в культурной жизни столицы</p>
      </section>
      <section style="flex:auto 1 0;">
        <BaseMediaSlider :posters="[
          { url: 'https://files.kipish.kg/static/info/1.jpg' },
          { url: 'https://files.kipish.kg/static/info/2.jpg' },
          { url: 'https://files.kipish.kg/static/info/3.jpg' },
          { url: 'https://files.kipish.kg/static/info/4.jpg' },
        ]"/>
      </section>
    </div>
  </section>
  <section class="statistics-section mid" data-aos="fade-up" data-aos-duration="1500">
    <div class="stat-items">
      <div class="stat-item" v-for="counter in counters">
        <div class="h1-font" style="font-size:68px; margin-bottom:2em;"><IncNum :value="counter.targetValue"/>k+</div>
        <div style="color:#444444; font-size:24px;">
          <div>{{ counter.label }}</div>
          <div>{{ counter.subLabel }}</div>
        </div>
      </div>
    </div>
  </section>
  <section class="carousel-section" data-aos="fade-up" data-aos-duration="1500">
    <ImageCarouselDesktop/>
  </section>
  <section class="news-section" data-aos="fade-up" data-aos-duration="1500">
    <DesktopNews/>
  </section>
</template>

<script lang="ts">
import { useAppStore } from '@/stores';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import ADpc from '~/components/common/ad/ADpc.vue';
import IncNum from '~/components/common/IncNum.vue';
import BaseAd from '~/components/common/BaseAd.vue';
import BaseMediaSlider from '~/components/common/BaseMediaSlider.vue';
import BasePosterSlider from '~/components/common/BasePosterSlider.vue';
import Marquee from '~/components/common/Marquee.vue';
import DesktopEstabs from '~/components/sections/estabsBlock/DesktopEstabs.vue';
import DesktopReports from '~/components/sections/reportsBlock/DesktopReports.vue';
import DesktopVideos from '~/components/sections/videoBlock/DesktopVideos.vue';
import DesktopNews from '~/components/sections/newsBlock/DesktopNews.vue';
import ImageCarouselDesktop from '~/components/common/ImageCarousel/ImageCarouselDesktop.vue';

export default defineComponent({
  components: { BasePosterSlider, Marquee, BaseAd, DesktopReports, DesktopVideos, DesktopEstabs, DesktopNews, ADpc, BaseMediaSlider, ImageCarouselDesktop, IncNum },
  computed: {
    ...mapStores( useAppStore ),
  },

  data() {
    return {
      loading: true,
      posters: [] as any[],
      counters: [
        {targetValue: 10, label: 'Более 10К отснятых', subLabel: 'репортажей'},
        {targetValue: 800, label: 'Нами было отснято', subLabel: '800К фотографий'},
        {targetValue: 50, label: 'С нами работает более 50+', subLabel: 'заведений'},
      ],
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
          this.posters = resp.data.content;
        })
        .catch((error) => {
          console.error('Error fetching posters:', error);
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
.statistics-section {
  .stat-items {
    display:flex;
    gap:1em;
    justify-content:space-around;

    .stat-item {
      flex:33% 0 0 ;

      &:not(:last-child) {
        border-right:1px solid #aaa;
      }
    }
  }
}
</style>
