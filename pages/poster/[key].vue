<template>
  <div>
    <template v-if="!appStore.isMobile">
      <PosterDesktop/>
    </template>
    <template v-else>
      <PosterMobile/>
    </template>
  </div>
</template>

<script lang="ts">
import PosterDesktop from "~/pages/poster/PosterDesktop.vue";
import PosterMobile from "~/pages/poster/PosterMobile.vue";
import { mapStores } from "pinia";


export default defineComponent({
  name: "Poster",
  middleware: ['checkSourceId'],
  components: { PosterDesktop, PosterMobile },
  computed: {
    ...mapStores( useAppStore )
  }
});
</script>
