<template>
  <div class="reports-desktop mid">
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/reports', title: 'Репортажи'}]"/>
    <h1 class="h1-font text-68 black--text font-title text-uppercase font-weight-300">Фотоотчеты с мероприятий в Бишкеке</h1>

    <TimeRouletteNew :dateMap="reportDateMap" @setActualDay="selectDay" class="my-15"/>

    <template v-if="currentDay" v-for="(curDateItem, dayIndex) of visibleDays" :key="curDateItem + dayIndex">
      <v-card-text data-aos="fade-up" data-aos-duration="1000" :class="dayIndex !== 0 && 'mt-8'" class="week-title px-0 pt-0 pb-0 d-flex justify-space-between">
        <!-- НАДПИСЬ ДНЯ НЕДЕЛИ И ДАТА -->
        <div v-if="curDateItem && Array.isArray(filteredReports[curDateItem])">
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
      <v-card-text v-if="dayIndex === 0 && !Array.isArray(filteredReports[curDateItem])" class="pa-0 mt-10"></v-card-text>

      <div v-else-if="Array.isArray(filteredReports[curDateItem]) && filteredReports[curDateItem]?.length === 0" class="text-62 black--text mt-6">Репортажей в этот день не найдено</div>

      <!-- Вставляем карточки рекламы среди карточек репортажей -->
      <section v-else class="d-flex flex-wrap reports-section pb-8" :class="dayIndex % 2 === 0 ? 'even-day' : 'odd-day'">
        <BaseReportCard :payload="report" v-if="filteredReports[curDateItem] && filteredReports[curDateItem].length > 0" width="416"
              v-for="(report, index) of filteredReports[curDateItem]" :key="report.id"
        >
        </BaseReportCard>
      </section>
    </template>
  </div>
</template>

<script lang="ts">

import { mapStores } from "pinia";
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";
import BaseReportCard from "~/components/common/BaseReportCard.vue";
import TimeRouletteNew from "~/components/common/TimeRouletteNew.vue";

export default {
  name: "ReportsDesktop",
  components: { TimeRouletteNew, BaseBreadcrumbs, BaseReportCard },
  computed: {
    ...mapStores( useAppStore ),

    filteredReports() {
      if (this.filterOptions?.name || this.filterOptions.establishmentName || this.filterOptions.date) {
        const filteredReportsMap: any = {};
        for (const curDateItem of this.visibleDays) {
          if (!this.reportsCacheMap[curDateItem]) continue;

          const filteredReports = this.reportsCacheMap[curDateItem].filter((report: any) => {
            const matchesName = this.filterOptions?.name && String(report.name)
              .toLowerCase()
              .includes(String(this.filterOptions.name).toLowerCase());

            const matchesEstablishmentName = this.filterOptions.establishmentName && String(report.establishment?.name)
              .toLowerCase()
              .includes(String(this.filterOptions.establishmentName).toLowerCase());

            return matchesName || matchesEstablishmentName;
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
  data: () => ({
    currentDate: new Date().toLocaleDateString("fr-CA"),
    openDatePicker: false,
    adverts: [] as any[],
    closeOnClick: true,
    scrollPosition: 0,
    parallaxMultiplier: 0.5,
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,

    currentDay: null as any,
    reports: [] as any[],
    reportDateMap: {} as any,
    reportsCacheMap: {} as any,

    selectedDay: null as any,
    visibleDays: [] as any[],
    potentialDays: [] as any[], // Массив потенциальных к загрузке дат

    showFilterOptions: false,
    filterOptions: {
      name: '',
      establishmentName: '',
      date: null
    },
    page: 0,
    size: 15,
    loading: false,
    loadingContent: false,
    loadingMore: false,
  }),
  beforeMount() {
    const today = new Date();
    this.currentDay = this.convertDateToFetchFormat(today);
  },
  mounted() {
    this.initOnScrollFetcher();
    this.getAdvertisements();
    this.getReports();
  },
  methods: {
    getDay(date: any) {
      const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      let i = new Date(date).getDay();
      return daysOfWeek[i];
    },

    async getAdvertisements() {
      try {
        const response = await this.$http.get('/advertisement');
        this.adverts = response.data.content;
      } catch (error) {
        console.error('Error fetching advertisement:', error);
        return null;
      }
    },

    initOnScrollFetcher() {
      console.warn(`initOnScrollFetcher`);

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

    convertDateToFetchFormat(date: any) {
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

    onFilterDateSelect(e: any) {
      this.selectDay(e);
    },

    selectDay(date: any) {
      const formattedDate = this.convertDateToFetchFormat(date);
      this.selectedDay = formattedDate;
      this.visibleDays = [this.selectedDay];
      this.page = 0;

      this.fetchReports(formattedDate);
    },

    // setSelectedCity(city) {
    //   this.city = city;
    //   this.getReports();
    // },

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

      this.fetchReportsDateMap()
        .then(() => {
          if (!this.selectedDay) {
            this.potentialDays = Object.keys(this.reportDateMap)
              .map( dateStr => new Date(dateStr) )
              .sort( (a: any, b: any) => b - a )
              .map( date => date.toLocaleDateString('fr-CA') );

            // показываем сразу 2 репортажа
            const dateCount = Math.min(this.potentialDays.length, 2);
            for (let i = 0; i < dateCount; i++) {
              const nextActualDate = this.convertDateToFetchFormat(this.potentialDays.shift());
              this.visibleDays.push(nextActualDate);
              this.fetchReports(nextActualDate);
            }
          }
        })
        .catch((error) => {
          console.error(error);
          this.selectDay( this.currentDay );
          // .. error
        })
        .finally(() => {
          this.loading = false;
        })
    },

    async fetchReports(requestDate: any) {
      this.loadingContent = true;
      if (this.reportsCacheMap[requestDate]) {
        this.reports = this.reportsCacheMap[requestDate];
        this.loadingContent = false;
        return Promise.resolve();
      } else {
        const params = {
          city: this.appStore.currentCity?.id ?? null,
          date: requestDate,
          sort: 'album_dt,desc',
        };
        const reportsPromise = this.$http.get(`/albums/byDate`, { params })
          .then(async r => {
            const newAlbums = r.data.content.filter((el: any) => el.status !== 'PRIVATE' && el.status !== 'ARCHIVED');
            const reportList = r.data?.content || [];
            this.reports = reportList;
            await this.fetchReportImages(this.reports);
            this.reportsCacheMap[requestDate] = reportList;
          })
          .finally(() => {
            this.loadingContent = false;
          });

        return reportsPromise;
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
      return this.$http.get(`/albums/dateMap`, { params })
        .then(r => {
          this.reportDateMap = r.data;
        });
    },
  },
}
</script>

<style lang="scss" scoped>
.dark-theme .v-picker__body >div{
  background: #1e1e1e;
}

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


// .filter-panel {
//   .v-icon {
//     color: black !important;
//   }

//   .v-input input {
//     color: black !important;

//     &::placeholder {
//       color: black !important;
//     }
//   }
// }

// .img_item {
//   .v-image__image {
//     transition: transform 0.5s ease !important;
//   }
// }


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
	margin-bottom: 40px;
	line-height:4em;
  }

  .even-day .report-card:nth-child(3n+2) {
	position: relative;
	top: 32px;
}

.odd-day .report-card:nth-child(3n+2) {
	position: relative;
	bottom: 32px;
  }

  .report-card:nth-child(3n+2) {
	// background-color: #a725fe;
  }


  .reports-section {
	position: relative;
    gap:32px;
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


</style>
