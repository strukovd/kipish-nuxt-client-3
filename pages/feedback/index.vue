<template>
  <div>
    <template v-if="!appStore.isMobile">
      <FeedbackDesktop/>
    </template>
    <template v-else>
      <FeedbackMobile/>
    </template>
  </div>
</template>

<script>
import { mapStores } from 'pinia';
import FeedbackDesktop from "./FeedbackDesktop.vue";
import FeedbackMobile from "./FeedbackMobile.vue";

export default {
  name: "Feedback",
  components: { FeedbackDesktop, FeedbackMobile },
  computed: {
    ...mapStores( useAppStore ),
  },
}
</script>
