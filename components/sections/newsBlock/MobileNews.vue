<template>
  <div class="mobile-estabs">
    <h1 class="font-title" style="font-size:28px; text-transform:uppercase; margin-bottom:1em; font-weight:300;">
      <div>Лучшие заведения</div>
      <div style="padding-left:1em;">Бишкека</div>
    </h1>

    <div class="estab-cards">
      <template v-if="!loading">
        <MCardEstab v-for="estab of estabs" :key="estab.id" :item="estab"></MCardEstab>
      </template>
      <template v-else>
        <div v-for="i of 4" :key="i" style="display:flex;flex-direction:column;overflow:hidden;border-radius:20px;position:relative;">
          <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
        </div>
      </template>
    </div>

    <div style="display:flex; justify-content:center; margin-top:110px; padding:0;">
      <button class="button-v1" @click="$router.push('/establishments')">СМОТРЕТЬ ВСЕ ЗАВЕДЕНИЯ</button>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import MCardEstab from "~/components/common/MCardEstab.vue";

export default {
  name: "MobileEstabs",
  components: { MCardEstab },
  computed: {
    ...mapStores(useAppStore, ['currentCity']),
  },
  data: () => ({
    loading: false,
    currentSlideEstab: [],
    estabs: [],
  }),
  created() {
    if (this.appStore.currentCity) {
      this.fetchEstabs()
    }
  },
  methods: {
    async fetchEstabs() {
      if(!this.appStore.currentCity) {
        return;
      }
      this.loading = true;
      this.currentSlideEstab = [];
      const params = {cityId: this.appStore.currentCity.id}
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
.mobile-estabs {
  .estab-cards {
    padding: 0;
    margin-top: 10px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    gap: 32px;
  }
}
</style>
