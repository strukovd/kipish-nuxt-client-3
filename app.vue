<template>
  <div @resize="handleResize">
    appStore.isMobile: {{ appStore.isMobile }}
    <br>
    windowWidth: {{ appStore.windowWidth }}
    <NuxtLayout :name="appStore.isMobile ? 'default-mobile' : 'default'">
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

<script lang="ts">
import '@mdi/font/css/materialdesignicons.css';
import '@/assets/style.scss';

import { useAppStore } from '@/stores';
import { mapStores } from 'pinia';

export default {
  computed: {
    ...mapStores( useAppStore ),
  },
  data() {
    return {

    }
  },
  methods: {
    initGlobalProperties() {
      this.appStore.windowWidth = document.body.clientWidth;
      this.appStore.isMobile = this.appStore.windowWidth <= 1400;
    },

    handleResize() {
      if(document?.body) {
        const wWidth = document.body.clientWidth;
        let baseWidth = 1440;

        if (wWidth < 1920) {
          baseWidth = wWidth * 0.75;
        }
      }
      else return;

      // this.updateElementSize(baseWidth);
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

      window.addEventListener("resize", this.handleResize);
    }
  },
  destroyed() {
    if( import.meta.browser ) {
      window.removeEventListener("resize", this.handleResize);
    }
  },
};
</script>
