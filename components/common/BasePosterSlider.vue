<template>
  <div class="base-poster-slider">
    <img class="corner" src="/images/light-corner.png"/>
    <v-carousel v-model="currentSlide" class="carousel" :continuous="false" hide-delimiters :show-arrows="false">
      <v-carousel-item class="slide" v-for="(poster, i) of posters" :key="i">
        <main v-if="poster" class="base-poster-block">
          <div style="position: absolute;width: 100%;height: 100%; background: #28282880;z-index: 998 !important;"></div>
          <v-img v-if="poster.files.filter((p)=> !p.isCover ).length" style="z-index: 997 !important;position: absolute; object-fit: cover !important;" height="100%" width="100%" lazy-src="/images/cover-2.jpg"
                :src="`https://files.kipish.kg/${poster.files.filter((p)=> !p.isCover )[0].minioBucket}/min-${poster.files.filter((p)=> !p.isCover )[0].minioPath}`"/>
          <v-img v-else-if="poster.files[0]" style="z-index: 997 !important;position: absolute; object-fit: cover !important;" height="100%" width="100%" lazy-src="/images/cover-2.jpg"
                :src="`https://files.kipish.kg/${poster.files[0].minioBucket}/min-${poster.files[0].minioPath}`"/>

          <div class="overlay">
            <v-row style="height: 100%" class="pa-0 ma-0">
              <v-col cols="6" class="left-side">
                <div class="d-flex flex-column">
                  <!-- Дата и заголовок -->
                  <span class="date" v-if="poster.date && !poster?.options?.hideDate">{{formatDate(poster.date)}}</span>
                  <span class="title" v-if="!poster?.options?.hideTitle" @click="$router.push('/event/' + poster.id)">{{poster.title}}</span>
                </div>
                <div v-if="!poster?.options?.hideDescription" class="d-flex">
                  <!-- Описание -->
                  <span class="description" v-html="poster.description"></span>
                </div>
              </v-col>
              <v-col cols="6" class="right-side">
                <div style="display: flex; flex-direction: column; justify-content: space-between;">
                  <!-- Место проведения -->
                  <div v-if="!poster?.options?.hideEstablishment" class="d-flex flex-column">
                    <span style="font-size:22px; line-height:32px; font-weight:200; opacity: 0.7; color: #FFFFFF">Место проведения/</span>
                    <span style="text-transform:uppercase; font-size:32px; line-height:42px; font-weight:550; color:#FFFFFF; margin-top:12px;">{{poster?.establishment?.name}}</span>
                  </div>
                  <v-spacer/>
                  <div class="d-flex flex-column align-end">
                    <div class="d-flex align-end">
                      <span class="text-44 font-weight-550 white--text mr-1">{{ currentSlide+1 }}/</span>
                      <span style="color: #4D4E4D" class="text-20 font-weight-550">{{posters.length}}</span>
                    </div>
                    <div class="mt-2 d-flex align-center">
                      <v-img width="40" height="40" @click="customPrevMedia" class="mr-4 cursor-pointer" src="/icons/ArrowLeft.svg"/>
                      <v-img width="40" height="40" @click="customNextMedia" class="cursor-pointer" src="/icons/ArrowRight.svg"/>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
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
.base-poster-slider {
  .corner {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

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
