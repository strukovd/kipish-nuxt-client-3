<template>
  <section id="default-layout">
    <AppHeader/>
    <main style="min-height:600px; padding-bottom:6em;">
      <slot/>
    </main>
    <AppFooter/>
  </section>
</template>
<script lang="ts">
import AppHeader from '~/components/common/AppHeader.vue';
import AppFooter from '~/components/common/AppFooter.vue';

export default {
  components: { AppHeader, AppFooter },
};

</script>
<style>
.default-layout {
  position:relative;
}
</style>
