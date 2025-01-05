<template>
  <div class="videos-desktop mid">
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/videos', title: 'Видеорепортажи'}]"/>
    <h1 class="h1-font text-68 black--text font-title text-uppercase font-weight-300">Видеоотчеты мероприятий в Бишкеке</h1>

    <TimeRouletteNew :dateMap="reportDateMap" @setActualDay="selectDay" class="my-15"/>

    <section v-if="showFilterOptions" data-aos="fade-down" data-aos-duration="300" class="reports-filter">
      <BaseTextBox v-model="filterOptions.name" placeholder="Название"/>
      <BaseTextBox @click="async ()=>{ const date = await $modal.show('', 'Calendar'); if(date) selectDay(date); }" v-model="selectedDay" placeholder="Выберите дату" disabled/>
    </section>

    <template v-if="currentDay" v-for="(curDateItem, dayIndex) of visibleDays" :key="curDateItem + dayIndex">
      <v-card-text data-aos="fade-up" data-aos-duration="1000" :class="dayIndex !== 0 && 'mt-8'" class="px-0 pt-0 pb-0 d-flex justify-space-between">
        <!-- НАДПИСЬ ДНЯ НЕДЕЛИ И ДАТА -->
        <div v-if="curDateItem">
          <span style="border-right: 1px solid rgba(17, 17, 17, 0.1);" class="pr-4 mr-4 text-32 font-weight-300 text-uppercase black--text font-title">{{ getDayOfWeekFormatted(curDateItem) }}</span>
          <span class="text-32 text-uppercase black--text">{{ formatDateFormatted(curDateItem) }}</span>
        </div>

        <!-- КНОПКА ФИЛЬТР, отображается только для первого дня -->
        <div v-if="dayIndex === 0">
          <button @click="toggleFilterPanel" class="button-v2" style="padding:.3em 1.6em;">
            <span>Фильтр</span>
            <heroicon name="filter" stroke="currentColor" fill="transparent"/>
          </button>
        </div>
      </v-card-text>

      <!-- РЕПОРТАЖИ -->
      <div v-if="dayIndex === 0 && !Array.isArray(filteredReports[curDateItem])"
            class="d-flex flex-wrap reports_block">
        <v-skeleton-loader
          class="skeleton_card"
          width="100%"
          height="600"
          type="image"
        />
      </div>
      <div v-else-if="Array.isArray(filteredReports[curDateItem]) && filteredReports[curDateItem]?.length === 0"
            class="text-62 black--text mt-8">Репортажей в этот день не найдено
      </div>

      <template v-else>
        <template v-if="filteredReports[curDateItem]?.length > 0">
          <div data-aos="fade-up"
                data-aos-duration="1000" v-for="(report, index) of filteredReports[curDateItem]"
                :key="report.id">
            <VPlayer
              :id="report.id"
              :title="report.title"
              :subTitle="formatDate(report.reportDate)"
              :label="report?.establishment?.name"
              :coverImage="report.coverPath ? `https://files.kipish.kg/${report.coverPath}` : ''"
              :coverId="report.coverImageId"
              :src="appStore.videoDomain + report.id"
              :link="'/video/' + report.id"
            />
          </div>
          <a-dpc data-aos="fade-left" class="my-15" :key="dayIndex" v-if="shouldShowDesktopEvents(dayIndex)"/>
        </template>
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import TimeRouletteNew from "@/components/common/TimeRouletteNew.vue";
import VPlayer from "@/components/common/VPlayer/VPlayer.vue";
import ADpc from "@/components/common/ad/ADpc.vue";
import BaseBreadcrumbs from '@/components/common/BaseBreadcrumbs.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';

export default {
  name: "VideosDesktop",
  components: { ADpc, VPlayer, TimeRouletteNew, BaseBreadcrumbs, BaseTextBox },
  computed: {
    ...mapStores( useAppStore ),

    filteredReports() {
      if (this.filterOptions?.name || this.filterOptions.date) {
        const filteredReportsMap: any = {};
        for (const curDateItem of this.visibleDays) {
          if (!this.reportsCacheMap[curDateItem]) continue;

          const filteredReports = this.reportsCacheMap[curDateItem].filter((report: any) => {
            const matchesName = this.filterOptions?.name && String(report.name)
              .toLowerCase()
              .includes(String(this.filterOptions.name).toLowerCase());

            return matchesName;
          });

          if (filteredReports.length > 0) {
            filteredReportsMap[curDateItem] = filteredReports;
            // filteredVisibleDays.push(curDateItem);
          }
        }

        return filteredReportsMap;
      } else {
        return this.reportsCacheMap;
      }
    }
  },

  head() {
    return {
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'},
        {
          rel: 'canonical',
          href: 'https://kipish.kg/videos/'
        }
      ],
    }
  },

  data: () => ({
    closeOnClick: true,
    scrollPosition: 0,
    parallaxMultiplier: 0.5,
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,
    advertisements: [] as any[],
    filterOptions: {
      name: '',
    } as any,

    currentDay: null as any,
    reports: [] as any[],
    reportDateMap: {} as any,
    reportsCacheMap: {} as any,

    selectedDay: null as any,
    visibleDays: [] as any[],
    potentialDays: [] as any[], // Массив потенциальных к загрузке дат

    showFilterOptions: false,
    page: 0,
    size: 15,
    loading: false,
    loadingContent: false,
    loadingMore: false,
  }),
  beforeMount() {
    const today = new Date();
    this.currentDay = this.convertDateToFetchFormat( today.toLocaleDateString('fr-CA') );
  },
  mounted() {
    this.initOnScrollFetcher();
    this.getReports();
  },

  methods: {
    shouldShowDesktopEvents(dayIndex: any) {
      return dayIndex >= 2 && (dayIndex - 2) % 3 === 0;
    },

    initOnScrollFetcher() {
      this.loadingMore = false;

      window.onscroll = () => {
        if (this.selectedDay) {
          return;
        }

        if (!this.loadingMore
          && !this.loading
          && !this.loadingContent
          && this.potentialDays?.length > 0) {
          let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 300;
          if (bottomOfWindow) {
            const nextActualDateRaw = this.potentialDays.shift();
            if(nextActualDateRaw) {
              const nextActualDate = this.convertDateToFetchFormat(nextActualDateRaw);
              this.visibleDays.push(nextActualDate);
              this.fetchReports(nextActualDate);
            }
          }
        }
      };
    },

    playVideo(video: any) {
      video.play = true;
    },

    fetchBulkImage(imageIdsArray: any) {
      return this.$http.post(`/files/getBulkFiles`, imageIdsArray)
        .then(r => {
          return r.data;
        });
    },

    convertDateToFetchFormat(date: string) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${day}-${month}-${year}`;
    },

    formatDate(dateString: any) {
      if (!dateString) {
        return 'Invalid date';
      }

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

    getDayOfWeekFormatted(date: any) {
      const [day, month, year] = date.split('-').map(Number);
      const formattedDate = new Date(year, month - 1, day); // Месяцы в JavaScript начинаются с 0
      const options = {weekday: 'long'} as any;
      return new Intl.DateTimeFormat('ru-RU', options).format(formattedDate);
    },

    formatDateFormatted(date: any) {
      const [day, month, year] = date.split('-').map(Number);
      const formattedDate = new Date(year, month - 1, day); // Месяцы в JavaScript начинаются с 0
      const options = {day: 'numeric', month: 'long'} as any;
      return new Intl.DateTimeFormat('ru-RU', options).format(formattedDate);
    },

    selectDay(date: any) {
      const formattedDate = this.convertDateToFetchFormat(date);
      this.selectedDay = formattedDate;
      this.visibleDays = [this.selectedDay];
      this.page = 0;

      this.fetchReports(formattedDate);
    },

    toggleFilterPanel() {
      this.showFilterOptions = !this.showFilterOptions;
    },

    getReports() {
      this.reports = [];
      this.page = 0;
      this.init();
    },

    init() {
      this.loading = true;
      // const requestDate = this.currentDay;

      this.fetchReportsDateMap()
        .then(() => {
          if (!this.selectedDay) {
            this.potentialDays = Object.keys(this.reportDateMap)
              .map(dateStr => new Date(dateStr))
              .sort( (a: any, b: any) => b - a )
              .map(date => date.toLocaleDateString('fr-CA'));

            for (let i = 0; i < 2; i++) {
              const nextActualDateRaw = this.potentialDays.shift();
              if(nextActualDateRaw) {
                const nextActualDate = this.convertDateToFetchFormat(nextActualDateRaw);
                this.visibleDays.push(nextActualDate);
                this.fetchReports(nextActualDate);
              }
            }
          } else {

          }
        })
        .catch((error) => {
          console.error(error);
          this.selectDay(this.currentDay);
          // .. error
        })
        .finally(() => {
          this.loading = false;
        })
    },

    async fetchReports(requestDate: any) {
      try {
        this.loadingContent = true;
        if (this.reportsCacheMap[requestDate]) {
          this.reports = this.reportsCacheMap[requestDate];
          this.loadingContent = false;
        } else {
          const params = {
            city: this.appStore.currentCity?.id ?? null,
            date: requestDate,
            sort: 'report_date,desc',
          };
          const response = await this.$http2.get(`/reports/video/byDate`, { params });
          console.log(response.data)
          const reportList = response.data?.content || [];
          this.reports = reportList;
          this.reportsCacheMap[requestDate] = reportList;
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        this.loadingContent = false;
      }
    },

    fetchReportsDateMap() {
      const params = {
        city: this.appStore.currentCity?.id ?? null,
      };
      return this.$http2.get(`/reports/video/dateMap`, { params })
        .then(r => {
          this.reportDateMap = r.data;
        });
    },
  },
}
</script>


<style lang="scss">
.filter-panel {
  .v-icon {
    color: black !important;
  }
  .v-input input {
    color: black !important;
    &::placeholder {
      color: black !important;
    }
  }
}

.videos-desktop {
  .reports-filter {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    margin:.6em 0;

    >* {
      flex:auto 1 0;
    }
  }

}

.reports_desc_container {
  .v-skeleton-loader__image {
    width: 100% !important;
    height: 516px !important;
    border-radius: 16px !important;
  }

  .skeleton_card {
    width: 100% !important;
    height: 516px !important;
    border-radius: 16px !important;
    margin-right: 32px;
    margin-top: 32px;

    &:nth-child(2n) {
      margin-right: 0;
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

  .link_video {
    &:hover {
      cursor: pointer;
      color: #fe252e !important;
      transition: all 0.5s ease-in-out;
    }
  }

  .scroll-container {
    display: flex;
    cursor: pointer;
    user-select: none;
    overflow-x: hidden;
  }

  .day-events {
    /* Добавьте стили для событий дня здесь */
  }

  .event {
  }

  .animated-container {
    position: absolute;
    width: 100%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.1s, transform 0.1s
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
    transform: translateY(-100%);
  }

  // .reports_block__card {
  //   transition: transform 0.3s ease; /* Добавьте плавность для эффекта */
  // }

  .video-card {
    width: 640px;
    height: 620px;
    margin-right: 32px;
    margin-bottom: 32px;

    .v-image {
      border-radius: 20px !important;
    }
  }

  .video-card:nth-child(even) {
    margin-right: 0;
  }

  .video-card:nth-last-child(-n+2) {
    margin-bottom: 0;
  }

  .video-card-solo {
    width: 1312px;
    height: 620px;
    margin-bottom: 32px;

    .v-image {
      border-radius: 20px !important;
    }

    &:last-child {
      margin-bottom: 0;
    }

    .vjs-tech {
      width: 100% !important;
    }
  }

  .wrapper {
    width: 1440px;
    margin: 0 auto;
  }

  .video_block {
    &__title {
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.1);
      display: inline-block;

    }
  }
}

</style>
