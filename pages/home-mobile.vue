<template>
  <section class="home-mobile">
    <section class="poster-section mmid" data-aos="fade-up" data-aos-duration="1500">
      <h1 class="font-title" style="font-size:28px; text-transform:uppercase; margin-bottom:2em; font-weight:300;">Медиа ресурс о светской жизни</h1>
      <ClientOnly>
        <BaseMobileSlider :posters="posters"/>
      </ClientOnly>
    </section>

    <section class="marquee-section" data-aos="fade-up" data-aos-duration="1500">
      <Marquee text="Стиль / Люди / События /"/>
    </section>

    <section class="ad-section mmid" data-aos="fade-up" data-aos-duration="1500">
      <ClientOnly>
        <BaseAd :loading="loading"/>
      </ClientOnly>
    </section>
  </section>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import BaseMobileSlider from '~/components/common/BaseMobileSlider.vue';
import Marquee from '~/components/common/Marquee.vue';
import BaseAd from '~/components/common/BaseAd.vue';

export default defineComponent({
  components: { BaseMobileSlider, Marquee, BaseAd },
  computed: {
    ...mapStores( useAppStore ),
  },
  data() {
    return {
      loading: true,
      posters: [] as any[],
    };
  },
  methods: {
    async fetchPosters() {
      this.loading = true;

      const params = {
        cityId: this.appStore.currentCity?.id ?? null,
      };
      this.$http2.get('/posters', {params})
        .then((resp)=>{
          this.posters = resp.data.content;
          if(this.posters?.length) {
            // парсим значение поля options
            this.posters.forEach((poster, inx) => {
              if (poster.options) {
                poster.options = JSON.parse(poster.options);
              }
            })
          }
        })
        .catch((error) => {
          console.error('Error fetching posters:', error);
        })
        .finally(() => {
          setTimeout(() => { this.loading = false; }, 0);
        });
    },
  },

  created() {
    this.fetchPosters();
  }
});
</script>

<style lang="scss">

</style>
