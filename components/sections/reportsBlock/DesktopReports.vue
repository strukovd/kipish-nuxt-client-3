<template>
  <div class="desktop-reports">
    <h1 class="h1-font text-82 font-weight-300 font-title black--text text-uppercase mr-8">
      <span>Актуальные</span>
      <span class="h2-font" style="padding-left:1em;">/ Каждая задача возможность <br/> сделать больше и лучше</span>
      <span style="padding-left:1em;">фотоотчеты</span>
    </h1>

    <div class="photo-cards pa-0 mt-10 d-flex flex-wrap" style="gap: 32px">
      <template v-for="(card, index) of reports" :key="index">
        <component
          :is="card?.advert ? 'BaseAdvertisement' : 'BaseReportCard'"
          :payload="card"
          width="416"
        ></component>
      </template>
    </div>

    <div style="display:flex; justify-content:center; margin-top:110px; padding:0;">
      <button class="button-v1" @click="$router.push('/reports')">СМОТРЕТЬ ВСЕ РЕПОРТАЖИ</button>
    </div>
  </div>

</template>

<script>
import { mapState } from "pinia";
import BaseReportCard from "~/components/common/BaseReportCard.vue";
import BaseAdvertisement from "~/components/common/BaseAdvertisement.vue";

export default {
  name: "DesktopReports",
  components: { BaseReportCard, BaseAdvertisement },
  computed: {
    ...mapState(useAppStore, ['currentCity'])
  },
  data: () => ({
    reports: [],
    advertisements: [],
    topOffset: 0,
    reportsReserve: [
      {
        id: 1,
        name: 'Dvor bar',
        establishment: {
          name: 'pab'
        },
        albumDate: '01-01-2024',
        files: [
          {
            imgReserve: true,
            isCover: true,
            file: '/images/reports/1.svg'
          }
        ],
      },
      {
        id: 2,
        name: 'Dvor bar',
        establishment: {
          name: 'pab'
        },
        albumDate: '01-01-2024',
        files: [
          {
            imgReserve: true,
            isCover: true,
            file: '/images/reports/1.svg'
          }
        ],
      },
      {
        id: 3,
        name: 'Dvor bar',
        establishment: {
          name: 'pab'
        },
        albumDate: '01-01-2024',
        files: [
          {
            imgReserve: true,
            isCover: true,
            file: '/images/reports/1.svg'
          }
        ],
      },
    ],
    loading: false
  }),
  mounted() {
  },
  created() {
    if (this.currentCity) {
      this.fetchReports();
    }
  },
  beforeDestroy() {
  },
  methods: {
    async fetchAds() {
      const params = {page: 0, size: 10};
      try {
        const response = await this.$http.get('/advertisement', {params});
        const newAdvertisements = response.data.content.filter(ad => ad.location === 'VERTICAL');

        if (newAdvertisements.length > 0) {
          // Берем 3 рандомных объявления из списка
          const randomAdvertisements = [];
          for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * newAdvertisements.length);
            randomAdvertisements.push(newAdvertisements[randomIndex]);
          }

          this.advertisements = randomAdvertisements.map(item => {
            return {...item, advert: true};
          });

          await this.fetchAdvertImages(this.advertisements);
          [3, 8, 9].forEach((index, i) => {
            this.reports.splice(index, 0, this.advertisements[i]);
          });
        }
      } catch (error) {
        console.error('Error fetching advertisement:', error);
      }
    },

    async fetchReports() {
      if (!this.currentCity) {
        return;
      }
      this.loading = true;
      try {
        const {data: {content}} = await this.$http.get(`/albums/top?city=${this.currentCity.id}&sort=priority,asc`);
        this.reports = content.splice(0, 9)
        await this.fetchReportImages(this.reports)
        await this.fetchAds();
        this.loading = false;
      } catch (error) {
        this.reports = this.reportsReserve;
        this.loading = false;
      }
    },

    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },

    async fetchReportImages(reports) {
      if (!reports) reports = this.reports;
      for (const report of reports) {
        if (report.coverImageId) {
          this.fetchImage(report.coverImageId)
            .then(image => {
              report.coverImage = image;
            });
        }
      }
    },
    async fetchAdvertImages(adverts) {
      if (!adverts) adverts = this.advertisements;
      for (const advert of adverts) {
        if (advert.fileDesktop.id) {
          advert.fileDesktop.file = `https://files.kipish.kg/${advert.fileDesktop.minioBucket}/min-${advert.fileDesktop.minioPath}`;
          // this.fetchImage(advert.fileDesktop.id)
          //   .then(image => {
          //     advert.fileDesktop.file = image;
          //     // Vue.set(advert.fileMobile, 'src', image);
          //   });
        }
      }
    },
    handleScroll() {
      this.topOffset = Math.max(80, 80 - window.scrollY);
    },
    formatDate(dateString) {
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
    getCoverFile(files) {
      const coverFile = files.find(el => el.isCover === true);
      return coverFile ? (coverFile.imgReserve ? coverFile.file : 'data:image/png;base64,' + coverFile.file) : null;
    },
  },
}
</script>

<style lang="scss">
.reset-styles {
  all: unset; /* Убирает все стили */
  display: inherit; /* Сбрасывает display на значение родителя */
  white-space: nowrap;
}
.desktop-reports {
  // .image_item {
  //   .v-image__image {
  //     transition: transform 0.5s ease !important;
  //   }
  // }

  // .zoomed {
  //   .v-image__image {
  //     transform: scale(1.2) !important;
  //   }
  // }

  // .v-skeleton-loader__image {
  //   height: 516px !important;
  //   border-radius: 16px !important;
  // }

  // .reports_card {
  //   width: 416px;
  //   height: 516px;
  //   margin-right: 32px;
  //   //margin-bottom: 32px;
  // }

  .photo-cards {
    .report-card {
      margin-bottom: -80px;
    }
  }
  .photo-cards:nth-child(3n) {
    margin-right: 0 !important;
  }

  .photo-cards:nth-last-child(-n+3) {
    margin-bottom: 0 !important;
  }

  .photo-cards:not(:nth-child(2)):not(:nth-child(5)):not(:nth-child(8)):not(:nth-child(11)) {
    margin-bottom: -50px !important;
  }

  .photo-cards:first-child {
    background:red !important;
  }

  .photo-cards> :nth-child(2),
  .photo-cards> :nth-child(5),
  .photo-cards> :nth-child(8),
  .photo-cards> :nth-child(11) {
    margin-top: 80px !important;
  }

}

</style>
