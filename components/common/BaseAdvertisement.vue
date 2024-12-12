<template>
  <div v-if="payload?.fileDesktop" class="advertisement-card" data-aos="fade-up" data-aos-duration="1000" :style="{width: width ? `${width}px` : 'auto'}">
    <v-img class="advertisement-card-image cursor-pointer"
      :src="payload.fileDesktop.file"
      lazy-src="/images/cover-2.jpg"
      height="516"
    >
      <router-link :to="payload.link ?? ''" :is="payload.link ? 'a' : 'div'" class="advertisement-card-content">
        <div>
          <div style="background: #FFFFFF33;border-radius: 30px;display: inline-block" class="py-1 px-4">
            <span class="text-18 white--text">Реклама</span>
          </div>
        </div>
        <!-- <div class="d-flex flex-column">
          <span class="text-16 opacity-70 white--text">{{ formatDate(payload.albumDate) }}</span>
          <span class="text-32 font-weight-550 white--text mt-3">{{ payload.name }}</span>
        </div> -->
      </router-link>
    </v-img>
  </div>
  <template v-else>
    <v-skeleton-loader
      class="mx-auto"
      :width="width"
      height="516"
      type="image"
    ></v-skeleton-loader>
  </template>
</template>

<script>

export default {
  props: { payload: Object, width: Number | String },
  data() {
    return {};
  },
  methods: {
    formatDate(dateString) {
      if(!dateString) return '';

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
  },
};
</script>

<style lang="scss">
.advertisement-card {
  position: relative;

  .advertisement-card-image {
    position: relative;
    border-radius: 20px;

    .v-img__img {
      transition:transform .5s ease !important;
      object-fit: cover !important;
      background-position: center center;
    }
    &:hover .v-img__img {
      transform:scale(1.2) !important;
    }

    .advertisement-card-content {
      position: absolute;
      z-index: 999;
      width: 100%;
      height: 100%;
      background: radial-gradient(50% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.60) 100%);

      padding: 24px 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      text-decoration:none;
      color:inherit;
    }
  }
}
</style>
