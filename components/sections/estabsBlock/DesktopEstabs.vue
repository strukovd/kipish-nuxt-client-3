<template>
    <div class="desktop-reports">
    <h1 class="h1-font text-82 font-weight-300 font-title black--text text-uppercase">
      <div>Лучшие заведения</div>
      <span style="padding-left:1em;">Бишкека</span>
      <span class="h2-font" style="padding-left:1em;">/ Каждый день <br> стратегически важен</span>
    </h1>

    <div style="position: relative;border-radius: 20px 0 0 20px; gap:2em;" class="d-flex flex-wrap mt-15">
      <template v-if="!loading">
        <BaseEstabCard v-for="estab of estabs" :key="estab.id" :item="estab"></BaseEstabCard>
      </template>
      <template v-else>
        <div v-for="i of 4" :key="i" style="display:flex;flex-direction:column;overflow:hidden;border-radius:20px;position:relative;">
          <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
        </div>
      </template>
    </div>

    <div style="display:flex; justify-content:center; margin-top:110px; padding:0;">
      <button class="button-v1" @click="$router.push('/reports')">СМОТРЕТЬ ВСЕ ЗАВЕДЕНИЯ</button>
    </div>
  </div>
</template>

<script>
import BaseEstabCard from "@/components/common/BaseEstabCard.vue";
import { mapState } from "pinia";

export default {
  name: "DesktopEstabs",
  components: { BaseEstabCard },
  computed: {
    ...mapState(useAppStore, ['currentCity']),
  },
  data: () => ({
    loading: false,
    currentSlideEstab: [],
    estabs: [],
  }),
  created() {
    if (this.currentCity) {
      this.fetchEstabs()
    }
  },
  methods: {
    async fetchEstabs() {
      if(!this.currentCity) {
        return;
      }
      this.loading = true;
      this.currentSlideEstab = [];
      const params = {cityId: this.currentCity.id}
      try {
        const { data: { content } } = await this.$http2.get('/establishments?top=true')
        // const filteredEstabs = content.filter(estab => estab.id === 37 || estab.id === 30 || estab.id === 41)
        // this.estabs = filteredEstabs.splice(0, 6);
        this.estabs = content;
        await this.fetchEstabsImages(this.estabs)
        this.currentSlideEstab = Array(this.estabs.length).fill(1);
        this.loading = false;
      } catch (e) {
        this.estabs = [];
        this.loading = false
      }
    },
    async fetchEstabsImages(estabs) {
      if (!estabs) estabs = this.estabs;
      for (const estab of estabs) {
        if (estab.coverImageId) {
          this.fetchImage(estab.coverImageId)
            .then(image => {
              estab.coverImage = image;
            });
        }
      }
    },
    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },

    customPrevEstab(estabIndex) {
      if (this.currentSlideEstab[estabIndex] > 1) {
        this.currentSlideEstab = [...this.currentSlideEstab];
        this.currentSlideEstab[estabIndex]--;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].prev();
        });
      }
    },
    customNextEstab(estabIndex) {
      if (this.currentSlideEstab[estabIndex] < this.estabs[estabIndex].images.filter(el => el.source === 'ESTABLISHMENT').length) {
        this.currentSlideEstab = [...this.currentSlideEstab];
        this.currentSlideEstab[estabIndex]++;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].next();
        });
      }
    },
  }
}
</script>

<style lang="scss">
.desktop_estabs {
  .button_link {
    &:hover {
      background: #373737 !important;
    }
  }

  .v-skeleton-loader__image {
    width: 416px !important;
    height: 600px !important;
    border-radius: 16px !important;
  }

  .estabs_card {
    width: 416px;
    height: 600px;
    margin-right: 32px !important;
    margin-bottom: 32px !important;
  }

  //.estabs_card:nth-child(3n+1),
  //.estabs_card:nth-child(3n+3) {
  //  .estabs_card__content {
  //    height: 340px !important;
  //  }
  //  height: 440px !important;
  //  .v-image {
  //    height: 340px !important;
  //  }
  //  .v-image__image {
  //    height: 340px !important;
  //  }
  //}

  //.estabs_card:nth-child(3n+2) {
  //  height: 420px !important;
  //  .estabs_card__content {
  //    height: 320px !important;
  //  }
  //  .v-image {
  //    height: 320px !important;
  //  }
  //  .v-image__image {
  //    height: 320px !important;
  //  }
  //}

  .estabs_card:nth-child(3n) {
    margin-right: 0 !important;
  }

  .estabs_card:nth-last-child(-n+3) {
    margin-bottom: 0 !important;
  }
}

</style>
