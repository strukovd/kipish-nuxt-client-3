<template>
  <div id="main-page">
    <template v-if="true || appStore.currentCity">
      <div>
        <template v-if="!appStore.isMobile">
          <Home key="home"/>
        </template>
        <template v-else>
          <HomeMobile key="home-mobile"/>
        </template>
      </div>
    </template>
    <template v-else>
      <h2>Выберите город</h2>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAppStore } from '@/stores';
import { mapStores } from 'pinia';
import Home from './home.vue';
import HomeMobile from './home-mobile.vue';
// import DesktopMedia from '~/components/sections/mediaBlock/DesktopMedia.vue';
// import DesktopStats from '~/components/sections/statBlock/DesktopStats.vue';

export default defineComponent({
  name: 'MainPage',
  components: { Home, HomeMobile, },
  computed: {
    ...mapStores( useAppStore ),
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss">
#main-page {
  [class*="-section"]:not(:first-child) {
    margin-top: 6em;
  }

  .h1-font {
    font-family: ALS Gorizont, sans-serif;
    font-size: 82px;
    line-height: 92px;
    font-weight: 300;
    text-transform: uppercase;
  }
}
</style>
