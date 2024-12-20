<template>
  <div class="mobile-reports">
    <h1 class="font-title" style="font-size:28px; text-transform:uppercase; margin-bottom:1em; font-weight:300;">
      <div>Актуальные</div>
      <div style="padding-left:1em;">фотоотчеты</div>
    </h1>

    <div class="video-cards">
      <div v-for="(report, index) of videos" :key="report.id" data-aos="fade-up" data-aos-duration="1000">
        <VPlayerMobile
          :id="report.id"
          :title="report.title"
          :coverId="report.coverImageId"
          :subTitle="formatDate(report.reportDate)"
          :label="report?.establishment?.name"
          :coverImage="`https://files.kipish.kg/${report.coverPath}`"
          :src="appStore.videoDomain + report.id"
          :link="'/video/' + report.id"
        />
      </div>
    </div>

    <div style="display:flex; justify-content:center; margin-top:110px; padding:0;">
      <button class="button-v1" @click="navigateTo('/videos')">СМОТРЕТЬ ВСЕ РЕПОРТАЖИ</button>
    </div>
  </div>




  <!-- <div class="mt-6">
    <div style="position: relative;border-radius: 12px !important;" class="video_item" v-for="(video, index) in videos"
      :key="video.id">
      <div :style="video.play ? 'z-index: 998' : 'z-index: 9999999'" style="position: absolute;width: 100%;height: 100%;background:#28282880; border-radius: 12px !important;"></div>
      <div :style="video.play ? 'z-index: 998' : 'z-index: 9999999'" style=" position: absolute; z-index: 997 !important; height:100%; width: 100%"
        class="d-flex flex-column justify-space-between px-4 pt-4 pb-5">
        <div>
          <div v-if="video?.establishment?.name" class="py-1 px-4 video_block__title">
            <span class="text-14 white--text">{{ video.establishment.name }}</span>
          </div>
        </div>
        <div class="d-flex align-center flex-column">
          <div style="z-index: 998; position: absolute; right: 50%; top: 47%; transform: translate(50%, -50%); " @click="playVideo(video.id)" class="player_button mb-5">
            <div v-if="!video.loading">
              <v-img width="35" height="35" src="/static/images/icons/player.png" />
            </div>
            <div v-if="video.loading">
              <v-img class="circle_block" width="35" height="35" src="/static/images/logo2.svg" />
            </div>
          </div>
          <span class="text-14 font-weight-300 white--text opacity-70">{{ formatDate(video.reportDate) }}</span>
          <span  @click="$router.push(`/video/${video.id}`)" class="text-26 font-weight-550 white--text mt-1 text-center">{{ truncateText(video.title, 40) }}</span>
        </div>
      </div>
      <template v-if="video.play || !video.coverImageId">
        <video-player style="position: absolute;width: 100%;height: 100%;z-index: 999 !important;"
                      :controls="video.play ? true : false"
                      :autoplay="video.play && !video.loading"
                      :file="videoDomain + video.id"
                      >
        </video-player>
      </template>
      <template v-if="!video.play">
        <v-img lazy-src="/static/images/cover-2.jpg" height="100%" style="border-radius: 12px; z-index: 997 " :src="video.coverImage" />
      </template>
    </div>
  </div> -->

</template>

<script lang="ts">
import VPlayerMobile from "~/components/common/VPlayer/VPlayerMobile.vue";
import { mapStores } from 'pinia';

export default defineComponent({
  name: "DesktopReports",
  components: { VPlayerMobile },
  computed: {
    ...mapStores( useAppStore )
  },

  data: () => ({
    videos: [] as any[],
    advertisements: [],
    topOffset: 0,
    loading: false
  }),

  created() {
    if (this.appStore.currentCity) {
      this.fetchVideos();
    }
  },

  methods: {
    async fetchVideos() {
      if (!this.appStore.currentCity) {
        return;
      }
      try {
        const { data: { content } } = await this.$http2.get(`/reports/video/top?city=${this.appStore.currentCity.id}&size=2`);
        this.videos = content
          .filter((el: any) => el.top)
          .map((el: any) => ({
            ...el,
            videoUrl: null,
            play: false,
            loading: false
          }));
      } catch (error) {
        console
      }
    },

    handleScroll() {
      this.topOffset = Math.max(80, 80 - window.scrollY);
    },

    formatDate(dateString: string) {
      if(dateString){
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
      }
    },
  },
});
</script>

<style lang="scss">
.mobile-reports {
  .photo-cards {
    padding: 0;
    margin-top: 10px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
  }
}

</style>
