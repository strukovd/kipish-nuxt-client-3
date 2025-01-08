<template>
  <div class="base-media-slider">
    <v-carousel v-model="currentSlide" class="carousel" :continuous="false" hide-delimiters :show-arrows="false" cycle interval="5000">
      <v-carousel-item class="slide" v-for="(poster, i) of posters" :key="i">
        <v-img v-if="poster?.url"
          style="z-index: 997 !important;position: absolute; object-fit: cover !important;"
          height="100%"
          width="100%"
          lazy-src="/images/cover-2.jpg"
          :src="poster.url"
        />

        <main class="base-poster-block">
          <section>
            <h2 class="h1-font" style="z-index: 999; font-size:82px; line-height:1.2em; position:relative; color:#fff; padding-left:.2em;"><span>вместе</span></h2>
          </section>
          <section class="arrows" style="position: absolute; right: 0; bottom: 0; display: flex; gap: .4em; padding:1em 1.4em; z-index: 9999;">
            <v-img width="40" height="40" @click="customPrevMedia" class="mr-4 cursor-pointer" src="/icons/ArrowLeft.svg"/>
            <v-img width="40" height="40" @click="customNextMedia" class="cursor-pointer" src="/icons/ArrowRight.svg"/>
          </section>
        </main>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  props: {
    posters: Array
  },
  data() {
    return {
      currentSlide: 0
    };
  },
  methods: {
    customPrevMedia() {
      if (this.currentSlide > 0) {
        this.currentSlide--;
      }
    },

    customNextMedia() {
      if (this.currentSlide < this.posters.length-1) {
        this.currentSlide++;
      }
    },

    formatDate(dateString) {
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
.base-media-slider {

  .carousel {
    position: relative;
    z-index: 997 !important;
    border-radius: 32px;

    .slide {
      position: relative;

      .base-poster-block {
        .overlay {
          position: absolute;
          z-index: 999 !important;
          width: 100%;
          height: 100%;

          .left-side {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 44px 48px 36px 48px;
            margin-top: 100px;

            .date {
              font-size:22px;
              line-height:32px;
              color: #fff;
              opacity: 70%;
              font-weight: 200;
            }

            .title {
              font-size: 48px;
              line-height: 58px;
              font-weight: 720;
              cursor: pointer;
              color: #fff;
              text-transform: uppercase;
              margin-top: 24px;

              &:hover {
                cursor: pointer;
                color: #fe252e !important;
                transition: all 0.2s ease-in-out;
              }
            }
          }

          .right-side {
            display: flex;
            justify-content: end;
            padding: 36px 48px;
          }


          .description {
            font-size:20px;
            line-height:30px;
            opacity: 70%;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
