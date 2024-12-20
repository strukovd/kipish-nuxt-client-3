<template>
  <div class="base-mobile-slider">
    <VueperSlides :autoplay="posters && posters?.length > 1" :infinite="false" :arrows="true">
      <VueperSlide v-for="(poster, index) in posters" :key="poster.id" class="cursor-pointer">
        <template #content>
            <v-img lazy-src="/images/cover-2.jpg" style="position: relative" width="100%" height="100%"
                  :src="`https://files.kipish.kg/${poster.coverPath}`">
              <div style="position: absolute; width: 100%;height: 100%;z-index:998;background: #28282880"></div>
              <div style="position:absolute;width:100%;height: 100%;z-index:999;display:flex;flex-direction:column; padding:1.4em;">
                <div v-if="!poster?.options?.hideEstablishment" class="d-flex text-left flex-column" style="flex:auto 1 0">
                  <span class="text-14 white--text opacity-70 font-weight-200">Место проведения/</span>
                  <span class="text-16 white--text font-weight-550 text-uppercase">{{
                      poster?.establishment?.name
                    }}</span>
                </div>
                <div class="d-flex text-left flex-column mt-13">
                  <span v-if="poster.date && !poster?.options?.hideDate" class="text-14 opacity-70 white--text">{{ formatDate(poster.date) }}</span>
                  <span v-if="!poster?.options?.hideTitle" @click="navigateTo(`/event/${poster.id}`)" class="text-28 font-weight-550 white--text mt-1 mb-2">{{ poster.title }}</span>
                  <span v-if="!poster?.options?.hideDescription" v-html="poster.description" class="text-12 white--text opacity-70"></span>
                </div>
              </div>
            </v-img>
        </template>
      </VueperSlide>
      <template #bullet="{ active, slideIndex, index }">
        <v-img :width="appStore.windowWidth <= 400 ? '50' : '64'" v-if="active" src="/images/slide-active.svg"/>
        <v-img :width="appStore.windowWidth <= 400 ? '50' : '64'" v-if="!active" src="/images/slide-unactive.svg"/>
      </template>
    </VueperSlides>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import { VueperSlides, VueperSlide } from 'vueperslides';
import 'vueperslides/dist/vueperslides.css';

export default defineComponent({
  components: { VueperSlides, VueperSlide },
  computed: {
    ...mapStores( useAppStore ),
  },
  props: {
    posters: Array as () => Array<any>,
  },
  data() {
    return {

    };
  },
  methods: {
    formatDate(dateString: string) {
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
});
</script>

<style lang="scss">
.base-mobile-slider {
  .vueperslides__arrow {
    opacity: 0;
  }

  .vueperslides__parallax-wrapper {
    border-radius: 12px;
    height: 360px;
  }
}
</style>


