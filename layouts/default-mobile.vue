<template>
  <section id="default-layout">
    <ClientOnly>
      <AppMobileHeader/>
    </ClientOnly>
    <main style="padding-bottom:6em;">
      <slot/>
    </main>
    <ClientOnly>
      <aside>
        <div class="button-scroll-arrow"
            v-show="appStore.shouldShowScrollArrow"
            @click="scrollTo(appStore.shouldShowScrollArrow)"
            :class="[appStore.shouldShowScrollArrow]"
        >
          <div style="width: 24px;height: 24px">
            <v-img src="/icons/ArrowTop.svg" :style="{
              rotate: appStore.shouldShowScrollArrow === 'up' ? '180deg' : undefined
            }"/>
          </div>
        </div>
      </aside>
    </ClientOnly>
    <ClientOnly>
      <AppFooterMobile/>
    </ClientOnly>
  </section>
</template>

<script lang="ts">
import AppMobileHeader from '~/components/common/AppMobileHeader.vue';
import AppFooterMobile from '~/components/common/AppFooterMobile.vue';
import { mapStores } from 'pinia';

export default {
  components: { AppMobileHeader, AppFooterMobile },
  computed: {
    ...mapStores( useAppStore ),
  },

  methods: {
    scrollTo(direction: 'top' | 'bottom') {
      const destinationElement = document.body;
      if (destinationElement) {
        if(direction === 'top') {
          window.scrollTo({
            top: document.body.offsetTop,
            behavior: 'smooth'
          });
        }
        else if(direction === 'bottom') {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    },
  }
};
</script>

<style>
#default-layout {
  position:relative;

  .button-scroll-arrow {
    background: white;
    position: fixed;
    bottom: 2em;
    right: 2em;
    z-index: 99999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 54px;
    height:54px;
    transition:all 300ms ease 0s;

    &.bottom {
      rotate: 180deg;
    }
  }
}
</style>
