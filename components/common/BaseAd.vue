<template>
  <div class="base-ad">
    <v-skeleton-loader v-if="loading" style="border-radius: 17px;" type="image" width="100%" height="240px"/>
    <div v-else>
      <a :href="advertisement?.link" target="_blank" rel="noreferrer">
        <img class="ad-img" lazy-src="/images/cover-2.jpg" :height="appStore.isMobile ? `240px` : `320px`" width="100%" :src="advertisementPath"/>
      </a>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia';

export default {
  props: {
    loading: {type: Boolean, default: false}
  },
  computed: {
    ...mapStores( useAppStore, ['isMobile'] ),
    advertisementPath() {
      let ad;
      if( this.appStore.isMobile ) {
        ad = this.advertisement?.fileMobile ?? 'https://files.kipish.kg/advertisement/ADVERTISEMENT/380%D1%85360.gif';
      }
      else {
        ad = this.advertisement?.fileDesktop ?? 'https://files.kipish.kg/advertisement/ADVERTISEMENT/1300х320.gif';
      }

      return `https://files.kipish.kg/advertisement/${ad?.minioPath}`;
    }
  },
  data: () => {
    return {
      advertisements: [],
      advertisement: null
    }
  },
  mounted() {
    this.getAdvertisements()
  },
  methods: {
    async getAdvertisement() {
      try {
        const {id} = this.advertisements[Math.floor(Math.random() * this.advertisements.length)]
        let {data} = await this.$http.get('/advertisement/' + id)
        this.advertisement = data
        // await this.setImage(this.ad.id)
      } catch (error) {
        console.error('Error fetching advertisement:', error);
        return null;
      }
    },

    async getAdvertisements() {
      try {
        const response = await this.$http.get('/advertisement/ids');
        this.advertisements = response.data.filter(ad => ad.location === 'HORIZONTAL');
        await this.getAdvertisement();
      } catch (error) {
        console.error('Error fetching advertisement:', error);
        return null;
      }
    },
  }
}
</script>


<style scoped lang="scss">
.base-ad {
  .ad-img {
    border-radius:12px; overflow:hidden;
  }
}
</style>
