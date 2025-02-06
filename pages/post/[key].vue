<template>
  <div>
    <template v-if="!$device.isMobile">
      <PostDesktop/>
    </template>
    <template v-else>
      <PostMobile/>
    </template>
  </div>
</template>

<script lang="ts">
import PostDesktop from "~/pages/post/PostDesktop.vue";
import PostMobile from "~/pages/post/PostMobile.vue";
import { mapStores } from "pinia";


export default defineComponent({
  name: "Post",
  middleware: ['checkSourceId'],
  components: { PostDesktop, PostMobile },
  computed: {
    ...mapStores( useAppStore )
  }
});
</script>
