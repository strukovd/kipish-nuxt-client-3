<template>
  <section id="default-layout">
    <AppHeader/>
    <main>
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
