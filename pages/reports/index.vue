<template>
  <div>
    <template v-if="appStore.windowWidth > 1400">
      <ReportsDesktop />
    </template>
    <template v-if="appStore.windowWidth <= 1400">
      <!-- <ReportsMobile /> -->
    </template>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
// import ReportsMobile from './ReportsMobile.vue';
import ReportsDesktop from './ReportsDesktop.vue';

export default defineComponent({
  components: { ReportsDesktop },
  computed: {
    ...mapStores( useAppStore ),
  },
  data() {
    return {

    };
  },
  methods: {
  },
});
</script>

<style lang="scss">

</style>
