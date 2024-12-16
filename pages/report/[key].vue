<template>
  <div>
    sourceId:
    {{ JSON.stringify(appStore.sourceId) }}
    <template v-if="!appStore.windowWidth || appStore.windowWidth > 1400">

    </template>
    <template v-if="appStore.windowWidth <= 1400">

    </template>
  </div>
</template>

<script lang="ts">
// import ReportDesktop from "@/pages/report/ReportDesktop.vue";
// import ReportMobile from "@/pages/report/ReportMobile.vue";
import { mapStores } from "pinia";


export default defineComponent({
  name: "Report",
  middleware: ['checkSourceId'],
  // components: { ReportDesktop },
  computed: {
    ...mapStores( useAppStore )
  }
});

// definePageMeta({
//   middleware: 'checkSourceId',
// });
</script>
