<template>
  <div @resize="onResize">
    <NuxtLayout :name="layout">
      <ClientOnly>
        <transition name="modal">
          <ModalWrapper v-if="appStore.modals.length"/>
        </transition>
      </ClientOnly>

      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script lang="ts">
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/style.scss';

import { mapStores } from 'pinia';

export default {
  head() {
    return {
      link: [
        { rel: 'icon', type: 'image/svg', href: '/favicon.svg' }
      ]
    }
  },

  computed: {
    ...mapStores( useAppStore ),

    layout() {
      return this.appStore.isMobile ? 'default-mobile' : 'default';
    }
  },

  watch: {
    'appStore.isDark'() {
      if(this.appStore.isDark) document.body.classList.add('dark-theme');
      else document.body.classList.remove('dark-theme');
    }
  },

  data() {
    return {

    }
  },
  methods: {
    initGlobalProperties() {
      this.appStore.windowWidth = document.body.clientWidth;
      this.appStore.isMobile = document.body.clientWidth <= 1400;
    },

    onResize() {
      if(document?.body) {
        const wWidth = document.body.clientWidth;
        // let baseWidth = 1440;

        if (wWidth < 1920) {
          // baseWidth = wWidth * 0.75;
        }
      }
      else return;

      this.appStore.windowWidth = document.body.clientWidth;
      this.appStore.isMobile = document.body.clientWidth <= 1400;
    },
  },

  created() {
    if( import.meta.browser ) {
      this.initGlobalProperties();

      window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
          document.body.classList.add('scrolled'); // Добавляем класс, если страница прокручена
        } else {
          document.body.classList.remove('scrolled'); // Убираем класс, если вернулись наверх
        }
      });

      window.addEventListener("resize", this.onResize);
    }
  },
  destroyed() {
    if( import.meta.browser ) {
      window.removeEventListener("resize", this.onResize);
    }
  },
};
</script>

<style lang="scss">
.modal-enter-active, .modal-leave-active {
  transition:opacity .2s ease-in 0s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
