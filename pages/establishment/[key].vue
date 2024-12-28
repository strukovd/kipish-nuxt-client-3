<template>
  <div>
    <template v-if="!appStore.isMobile">
      <EstablishmentDesktop/>
    </template>
    <template v-else>
      <!-- <EstablishmentMobile/> -->
    </template>
  </div>
</template>

<script lang="ts">
import EstablishmentDesktop from "~/pages/establishment/EstablishmentDesktop.vue";
// import EstablishmentMobile from "~/pages/establishment/EstablishmentMobile.vue";
import { mapStores } from "pinia";


export default defineComponent({
  name: "Establishment",
  middleware: ['checkSourceId'],
  components: { EstablishmentDesktop,  },
  computed: {
    ...mapStores( useAppStore )
  }
});
</script>
