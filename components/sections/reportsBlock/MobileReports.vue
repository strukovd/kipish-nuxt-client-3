<template>
  <div class="mobile-reports">
    <h1 class="font-title" style="font-size:28px; text-transform:uppercase; margin-bottom:1em; font-weight:300;">
      <div>Актуальные</div>
      <div style="padding-left:1em;">фотоотчеты</div>
    </h1>

    <div class="photo-cards">
      <template v-for="(card, index) of reports" :key="index">
        <component
          :is="card?.advert ? 'BaseAdvertisement' : 'BaseReportCard'"
          :payload="card"
          style="width:100%; height:360px;"
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
    loading: false
  }),

  created() {
    if (this.currentCity) {
      this.fetchReports();
    }
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
          [2, 5].forEach((index, i) => {
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
        this.reports = content.splice(0, 5);
        await this.fetchReportImages(this.reports);
        await this.fetchAds();
        this.loading = false;
      } catch (error) {
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
  },
}
</script>

<style lang="scss">
.mobile-reports {
  .photo-cards {
    padding: 0;
    margin-top: 10px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    gap: 32px;
  }
}

</style>
