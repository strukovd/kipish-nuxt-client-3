<template>
  <section id="default-layout">
    <AppMobileHeader/>
    <main style="min-height:600px; padding-bottom:6em;">
      <slot/>
    </main>
    <AppFooter/>
  </section>
</template>

<script lang="ts">
import AppMobileHeader from '~/components/common/AppMobileHeader.vue';
import AppFooter from '~/components/common/AppFooter.vue';

export default {
  components: { AppMobileHeader, AppFooter },
};
</script>

<style>
.default-layout {
  position:relative;
}
</style>
