<template>
  <div>
    <template v-if="!appStore.windowWidth || appStore.windowWidth > 1400">
      <ReportDesktop/>
    </template>
    <template v-if="appStore.windowWidth <= 1400">
      <ReportMobile/>
    </template>
  </div>
</template>

<script lang="ts">
import ReportDesktop from "@/pages/report/ReportDesktop.vue";
import ReportMobile from "~/pages/report/ReportMobile.vue";
import { mapStores } from "pinia";


export default defineComponent({
  name: "Report",
  middleware: ['checkSourceId'],
  components: { ReportDesktop, ReportMobile },
  computed: {
    ...mapStores( useAppStore )
  }
});
</script>
