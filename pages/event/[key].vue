<template>
  <div>
    <template v-if="!appStore.isMobile">
      <EventDesktop/>
    </template>
    <template v-else>
      <EventMobile/>
    </template>
  </div>
</template>

<script lang="ts">
import EventDesktop from "~/pages/event/EventDesktop.vue";
import EventMobile from "~/pages/event/EventMobile.vue";
import { mapStores } from "pinia";


export default defineComponent({
  name: "Event",
  middleware: ['checkSourceId'],
  components: { EventDesktop, EventMobile },
  computed: {
    ...mapStores( useAppStore )
  }
});
</script>
