<template>
  <div class="mt-15 d-flex justify-center">
    <swiper
      class="swiper ma-auto"
      v-show="videos.length"
      style="width: 100% !important;"
      :effect="'coverflow'"
      :grabCursor="true"
      :centeredSlides="true"
      :slidesPerView="'auto'"
      :coverflowEffect="{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }"
      :pagination="true"
      :modules="modules">
      <swiper-slide
        style="height : 550px !important;max-width: 845px !important;border-radius: 16px !important;position: relative"
        class="mx-8 cursor-pointer" v-for="(video,index) in videos"
        :key="video.id" :index="index">
        <div :style="video.play ? 'z-index: 998' : 'z-index: 9999999'"
          style="position: absolute; height:100%; width: 100%; border-radius: 16px !important; overflow: hidden"
        >
          <div style="z-index: 997;position: absolute;width: 100%;height: 100%;background:#28282880"></div>
          <v-row class="fill-height ma-0">
            <v-col class="pa-0" cols="5">
              <div style="width: 100%;" class="d-flex fill-height flex-column justify-space-between pa-8">
                <div style="z-index: 998">
                  <div
                    class="py-1 px-4 video_block__title">
                    <span class="text-18 white--text">{{ video?.establishment?.name }}</span>
                  </div>
                </div>
                <div style="z-index: 998" class="d-flex flex-column mb-14">
                  <span class="text-18 font-weight-300 white--text opacity-70">{{ formatDate(video.reportDate) }}</span>
                  <span class="text-22 white--text">{{ video.title }}</span>
                </div>
              </div>
            </v-col>
            <v-col class="pa-0 d-flex justify-start" cols="7">
              <div class="d-flex align-center flex-column justify-center fill-height pl-10">
                <div style="z-index: 998" @click="playVideo(video.id)" class="player_button">
                  <div v-if="!video.loading">
                    <v-img width="44" height="44" src="/icons/player.png"/>
                  </div>
                  <div v-if="video.loading">
                    <v-img class="circle_block" width="40" height="40" src="/images/logo2.svg"/>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
        <template v-if="video.play || !video.coverPath">
          <video-player style="position: absolute;width: 100%;height: 100%;z-index: 999 !important;" :controls="video.play ? true : false" :autoplay="video.play" :file="appStore.videoDomain + video.id" />
        </template>
        <template v-if="!video.play">
          <v-img class="image_item_cover" lazy-src="/images/cover-2.jpg" height="100%" style="border-radius: 16px " :src="`https://files.kipish.kg/${video.coverPath}`"/>
        </template>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import VideoPlayer from "@/components/common/VideoPlayer.vue";
import Loader from "@/components/common/Loader.vue";
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { mapStores } from 'pinia';

export default defineComponent({
  name: "VideoSwiper",
  props: {
    videos: { type: Array as () => any[], default: [] },
  },
  setup() {
    return {
      modules: [EffectCoverflow, Pagination],
    };
  },
  components: {
    Swiper, SwiperSlide,
    VideoPlayer, Loader
  },
  computed: {
    ...mapStores( useAppStore ),
  },
  data() {
    return {};
  },
  methods: {
    formatDate(dateString: string) {
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const parts = dateString.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month, day);

      if (isNaN(date.getTime())) {
        console.error('Invalid date format:', dateString);
        return 'Invalid date';
      }

      const formattedDate = `${day} ${months[month]} / ${year}`;
      return formattedDate;
    },

    playVideo(id: any) {
      this.videos.forEach(video => {
        if (video.id === id) {
          video.play = true;
          video.loading = false;
        } else {
          video.play = false;
          video.loading = false;
        }
      })
    },
  },
});
</script>

<style lang="scss">

</style>
