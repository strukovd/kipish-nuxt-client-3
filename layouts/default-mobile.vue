<template>
  <section id="default-layout">
    <ClientOnly>
      <AppMobileHeader/>
    </ClientOnly>
    <main style="padding-bottom:6em;">
      <slot/>
    </main>
    <ClientOnly>
      <AppFooterMobile/>
    </ClientOnly>
  </section>
</template>

<script lang="ts">
import AppMobileHeader from '~/components/common/AppMobileHeader.vue';
import AppFooterMobile from '~/components/common/AppFooterMobile.vue';

export default {
  components: { AppMobileHeader, AppFooterMobile },
};
</script>

<style>
.default-layout {
  position:relative;
}
</style>
