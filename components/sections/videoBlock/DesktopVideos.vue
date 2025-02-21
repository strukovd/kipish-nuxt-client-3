<template>
  <div class="desktop-reports">
    <h1 class="h1-font mid text-82 font-weight-300 font-title black--text text-uppercase" v-html="$t('main.videos-title')"></h1>

    <ClientOnly>
      <VideoSwiper v-if="videos.length" :videos="videos" />
    </ClientOnly>

    <!-- <div class="photo-cards pa-0 mt-10 d-flex flex-wrap" style="gap: 32px">
      <template v-for="(card, index) of reports" :key="index">
        <component
          :is="card?.advert ? 'BaseAdvertisement' : 'BaseReportCard'"
          :payload="card"
          width="416"
        ></component>
      </template>
    </div> -->

    <div class="mid" style="display:flex; justify-content:center; margin-top:110px; padding:0;">
      <button class="button-v1" @click="navigateTo('/reports')">{{ $t('main.videos-show-more') }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import Loader from "@/components/common/Loader.vue";
import VideoSwiper from "~/components/common/VideoSwiper.vue";

export default {
  name: "DesktopVideos",
  components: { Loader, VideoSwiper },

  computed: {
    ...mapStores(useAppStore, ['videoDomain', 'currentCity']),
  },

  data: () => ({
    loadingVideos: false,
    videos: [] as any[],
    videosUpdated: false,
    swiperOption: {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      initialSlide: 1,
      autoplay: {
        delay: 3500,
        disableOnInteraction: true
      },
      coverflowEffect: {
        rotate: 0,
        stretch: -33,
        depth: 150,
        modifier: 1,
        slideShadows: false
      },
    },
  }),

  methods: {
    async fetchReports() {
      if (!this.appStore.currentCity) {
        return;
      }
      try {
        const { data: { content } } = await this.$http2.get(`/reports/video/top?city=${this.appStore.currentCity.id}`);
        this.videos = content
          .filter((el: any) => el.top)
          .map((el: any) => ({
            ...el,
            videoUrl: null,
            play: false,
            loading: false
          }));
        // await this.fetchVideoImages(this.videos);
        this.videosUpdated = false;
      }
      finally {
        this.loadingVideos = false;
      }
    },

    // fetchImage(imageId: any) {
    //   return this.$http.get(`/files/${imageId}`)
    //     .then(r => {
    //       const imageMap = r.data;
    //       return imageMap[imageId];
    //     });
    // },

    // async fetchVideoImages(videos: any) {
    //   if (!videos) videos = this.data;
    //   videos.forEach(video => {
    //     if (video.coverImageId) {
    //       this.fetchImage(video.coverImageId)
    //         .then(image => {
    //           video.coverImage = image;
    //         });
    //     }
    //   })
    // },

  },

  created() {
    if (this.appStore.currentCity) {
      this.fetchReports()
    }
  },
}
</script>

<style lang="scss">
.reset-styles {
  all: unset; /* Убирает все стили */
  display: inherit; /* Сбрасывает display на значение родителя */
  white-space: nowrap;
}

.image_item_cover {
  .v-image__image {
    background-size: cover;
    transition: transform 0.5s ease !important;
  }
}


.player_button {
  background: #FFFFFF1A;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    background: #FFFFFF2C;
  }
}

// .vjs-poster picture {
//   display: block;
//   width: 100%;
//   height: 100%;
// }

// .vjs-poster picture img {
//   width: 100%;
//   height: 100%;
//   object-fit: cover; /* заполнение */
//   object-position: center; /* позиционирование */
// }

// .video-js {
//   position: relative;
//   width: 100% !important;
//   height: 100% !important;
//   border-radius: 20px !important;
//   overflow: hidden;
// }

@supports (-webkit-appearance:none) and (not (-moz-appearance:none)) {
  .swiper-wrapper {
    overflow: visible !important;
  }
}
.swiper-wrapper {
  width: 5000px !important;
  overflow: hidden;
  z-index: 85 !important;

  .swiper-slide-prev {
    z-index: 99 !important;
  }

  .swiper-slide {
    z-index: 99 !important;
  }
}


// .video_block {
//   &__title {
//     border-radius: 30px;
//     background: rgba(255, 255, 255, 0.1);
//     display: inline-block;

//     span {
//     }
//   }

//   &__slide {

//   }

//   .swiper-slide-active {
//   }

// }

// .vjs-error-display {
//   display: none !important;
// }

// .vjs-big-play-button {
//   //display: block !important;
// }

// .vjs-control-bar {
// }
</style>
