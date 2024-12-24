<template>
  <div class="videos-mobile mmid3">
    <!-- BREADCRUMBS -->
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/videos', title: 'Видеорепортажи'}]"/>
    <h1 class="h1-font text-32 black--text font-title text-uppercase font-weight-300" style="margin-bottom:.6em;">Видеоотчеты мероприятий в Бишкеке</h1>

    <TimeRouletteNew :avgMonthWidth="1460" :dateMap="reportDateMap" @setActualDay="selectDay" class="mb-6"/>
    <BaseButton @click="showFilterOptions = !showFilterOptions">
      <span>Фильтр</span>
      <heroicon name="filter" stroke="currentColor" fill="transparent"/>
    </BaseButton>
    <!-- <div class="filter">
      <transition name="fade">
        <div v-if="showFilterOptions" class="d-flex flex-column mt-4 filter-panel">
          <v-text-field v-model="filterOptions.name" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details placeholder="Название"/>
          <v-text-field v-model="filterOptions.establishmentName" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details class="mt-4" placeholder="Заведение"/>
          <v-btn style="border: none; margin: 0; background: #ffffff; border-radius: 12px !important; border: 1px solid rgba(0, 0, 0, 0.10)" outlined color="white" class="d-flex justify-start text-none py-7 px-3 mt-4" @click="openDatePicker = true">
            <span style="color: #000000" class="text-16 mr-3 font-weight-375">{{ selectedDay ? selectedDay : 'Выберите дату'}}</span>
          </v-btn>
        </div>
      </transition>
    </div> -->


    <template v-if="currentDay" v-for="(curDateItem, dayIndex) of visibleDays" :key="curDateItem + dayIndex">
      <v-card-text data-aos="fade-up" data-aos-duration="1000" :class="dayIndex !== 0 && 'mt-8'" class="week-title px-0 pt-0 pb-0 d-flex justify-space-between">
        <!-- НАДПИСЬ ДНЯ НЕДЕЛИ И ДАТА -->
        <div v-if="currentDay && Array.isArray(reportsCacheMap[curDateItem])">
          <span style="border-right: 1px solid rgba(17, 17, 17, 0.1);" class="text-20 font-weight-300 text-uppercase black--text font-title mr-2">{{ getDayOfWeekFormatted(curDateItem) }}</span>
          <span class="text-14 text-uppercase dark--text">{{ formatDateFormatted(curDateItem) }}</span>
        </div>
      </v-card-text>

      <!-- РЕПОРТАЖИ -->
      <Loader v-if="dayIndex === 0 && !Array.isArray(reportsCacheMap[curDateItem])"/>
      <div v-else-if="Array.isArray(reportsCacheMap[curDateItem]) && reportsCacheMap[curDateItem]?.length === 0" class="text-32 black--text mt-6">Репортажей в этот день не найдено</div>

      <!-- Вставляем карточки рекламы среди карточек репортажей -->
      <section v-else class="video-cards">
        <template v-if="reportsCacheMap[curDateItem]?.length > 0">
          <div data-aos="fade-up" data-aos-duration="1000" v-for="(report, index) of reportsCacheMap[curDateItem]" :key="report.id">
            <VPlayerMobile
              :id="report.id"
              :title="report.title"
              :coverId="report.coverImageId"
              :subTitle="formatDate(report.reportDate)"
              :label="report?.establishment?.name"
              :coverImage="report?.coverPath ? `https://files.kipish.kg/${report.coverPath}` : ''"
              :src="appStore.videoDomain + report.id"
              :link="'/video/' + report.id"
            />
          </div>
        </template>
        <ADmob data-aos="fade-left" :key="dayIndex" v-show="shouldShowDesktopEvents(dayIndex)"/>
      </section>
    </template>

  </div>
</template>

<script lang="ts">

import { mapStores } from "pinia";
import ADmob from "~/components/common/ad/ADmob.vue";
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";
import BaseButton from "~/components/common/BaseButton.vue";
import BaseReportCard from "~/components/common/BaseReportCard.vue";
import Loader from "~/components/common/Loader.vue";
import TimeRouletteNew from "~/components/common/TimeRouletteNew.vue";
import VPlayerMobile from "~/components/common/VPlayer/VPlayerMobile.vue";

export default {
  name: "ReportsDesktop",
  components: { Loader, TimeRouletteNew, BaseBreadcrumbs, BaseReportCard, BaseButton, VPlayerMobile, ADmob },
  computed: {
    ...mapStores( useAppStore ),
  },

  data: () => ({
    closeOnClick: true,
    scrollPosition: 0,
    parallaxMultiplier: 0.5,
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,
    advertisements: [] as any[],
    showFilterOptions: false,

    currentDay: null as any,
    reports: [] as any[],
    reportDateMap: {} as any,
    reportsCacheMap: {} as any,

    selectedDay: null as any,
    visibleDays: [] as any[],
    potentialDays: [] as any[], // Массив потенциальных к загрузке дат

    filter: false,
    page: 0,
    size: 15,
    loading: false,
    loadingContent: false,
    loadingMore: false,
  }),

  beforeMount() {
    const today = new Date();
    this.currentDay = this.convertDateToFetchFormat(today.toLocaleDateString('fr-CA'));
  },
  mounted() {
    this.initOnScrollFetcher();
    this.getReports();
  },

  methods: {
    shouldShowDesktopEvents(dayIndex: any) {
      return dayIndex >= 2 && (dayIndex - 2) % 3 === 0;
    },

    getDay(date: any) {
      const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      let i = new Date(date).getDay();
      return daysOfWeek[i];
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
          && this.potentialDays.length > 0) {
          let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 300;
          if (bottomOfWindow) {
            console.warn(`onscroll`);

            const nextActualDate = this.convertDateToFetchFormat(this.potentialDays.shift());
            this.visibleDays.push(nextActualDate);
            this.fetchReports(nextActualDate);
          }
        }
      };
    },

    playVideo(video: any) {
      video.play = true;
    },

    fetchImage(imageId: any) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },

    fetchBulkImage(imageIdsArray: any) {
      return this.$http.post(`/files/getBulkFiles`, imageIdsArray)
        .then(r => {
          return r.data;
        });
    },

    convertDateToFetchFormat(date: string): string {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${day}-${month}-${year}`;
    },

    formatDate(dateString: any) {
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
      const options: any = {weekday: 'long'};
      return new Intl.DateTimeFormat('ru-RU', options).format(formattedDate);
    },

    formatDateFormatted(date: any) {
      const [day, month, year] = date.split('-').map(Number);
      const formattedDate = new Date(year, month - 1, day); // Месяцы в JavaScript начинаются с 0
      const options: any = {day: 'numeric', month: 'long'};
      return new Intl.DateTimeFormat('ru-RU', options).format(formattedDate);
    },

    selectDay(date: string) {
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
                const nextActualDate = this.convertDateToFetchFormat( nextActualDateRaw );
                this.visibleDays.push(nextActualDate);
                this.fetchReports(nextActualDate);
              }
            }
          }
        })
        .catch((error) => {
          console.error(error);
          // this.selectDay(this.currentDay);
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
          return;
        } else {
          const params = {
            city: this.appStore.currentCity?.id ?? null,
            date: requestDate,
            sort: 'report_date,desc',
          };
          const response = await this.$http2.get(`/reports/video/byDate`, { params });
          const reportList = response.data?.content || [];
          this.reports = reportList;
          // await this.fetchReportImages(this.reports);
          this.reportsCacheMap[requestDate] = reportList;
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        this.loadingContent = false;
      }
    },

    async fetchReportImages(reports: any) {
      if (!reports) reports = this.reports;

      //   const coverImageIdsArray = reports.map(report => report.coverImageId);
      //   return this.fetchBulkImage(coverImageIdsArray)
      //     .then( imageMap => {
      //       for (const report of reports) {
      //         report.coverImage = imageMap[report.coverImageId];
      //       }
      //     });

      // Загрузка по одной картинке
      for (const report of reports) {
        if (report.coverImageId) {
          this.fetchImage(report.coverImageId)
            .then(image => {
              report.coverImage = image;
            });
        }
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
.dark-theme .v-picker__body >div{
  background: #1e1e1e;
}

.videos-mobile {
  .v-picker--date {
    .v-picker__title {
      .v-date-picker-title {
        display: flex !important;
        justify-content: center;
        flex-direction: row !important;
        gap: 1em;
        flex-wrap: wrap;
        line-height: 1;
        display: flex;
        flex-direction: column;

        .v-date-picker-title__year {
          text-align: center;
          // display: block;
          font-size: 2em;
          opacity: 0.9;
          margin: auto 0 auto auto;
          // display: flex;
        }
        .v-date-picker-title__date {
          text-align: center;
          font-size: 1.6em;
          opacity: 0.6;
          padding: 0;
          margin: auto auto auto 0;
          display: flex;

          &:not(:empty)::before {
            content: '';
            display: block;
            width: 1px;
            height: 1em;
            margin: 0 .5em 0 0;
            background-color: #bfc7c7;
            opacity: 0.6;
          }
        }
      }
    }
    .v-picker__body {
      >div {
        // background: #1e1e1e;
      }
      .v-date-picker-header {
        font-weight: 400 !important;
      }
      .v-date-picker-table {
        th {
          font-size:.9em;
          font-weight:500;
          color: #bfc7c7;
        }

        td {
          button {
            border-radius: 4px;
          }
          .v-date-picker-table__current {
            // border-color:#FE252E99;
            background-color: #FE252E;
            color: whitesmoke !important;
            font-weight:600;
            border-color: #FE252E;
          }
        }
      }
    }
  }


  .v-skeleton-loader__image {
    width: 416px !important;
    height: 516px !important;
    border-radius: 16px !important;
  }

  .scroll-container {
    display: flex;
    cursor: pointer;
    user-select: none;
    overflow-x: hidden;
  }

  .week-title {
    margin:1em 0;
    line-height:4em;
  }


  .video-cards {
    position: relative;
    gap:1.2em;
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

  .reports_card {
    transition: transform 0.3s ease;
  }

  .reports_container {
    .image {

    }
  }

  .wrapper {
    width: 1440px;
    margin: 0 auto;
  }

  @media only screen and (max-width: 1024px) {
    .wrapper {
      width: 800px;
      margin: 0 auto;
    }
  }
}




</style>
