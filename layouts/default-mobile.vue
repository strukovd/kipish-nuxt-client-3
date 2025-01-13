<template>
  <section id="default-layout">
    <ClientOnly>
      <AppMobileHeader/>
    </ClientOnly>
    <main style="padding-bottom:6em;">
      <slot/>
    </main>
    <ClientOnly>
      <aside class="buttons-container">
        <button class="button-scroll-arrow"
          v-show="appStore.shouldShowScrollArrow"
          @click="scrollTo(appStore.shouldShowScrollArrow)"
          :class="[appStore.shouldShowScrollArrow]"
        >
          <img style="width: 32px;height: 32px" src="/icons/ArrowTop.svg" :style="{ rotate: appStore.shouldShowScrollArrow === 'up' ? '180deg' : undefined }"/>
        </button>
        <button class="button-book" v-show="needShowBookButton" @click="$modal.show('', 'book')">Забронировать столик</button>
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

    needShowBookButton() {
      const router = useRouter();
      const { currentRoute } = router;

      return /\/establishment\/[\w\-]+$/.test(currentRoute.value.path);

    },
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

  .buttons-container {
    position: fixed;
    bottom: 2em;
    right: 2em;
    display: flex;
    justify-content: right;
    gap: 1em;
    width: 500px;
    z-index: 99999;

    button {
      display: block;
      background-color: #f0f0f0;
      box-shadow: 0 0 10px rgba(0,0,0,.3);
      color: #333;
      line-height: 54px;
      height:54px;
      cursor: pointer;
    }

    .button-scroll-arrow {
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

    .button-book {
      padding:0 2em;
      border-radius: 50px;
    }
  }
}
</style>
