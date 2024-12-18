<template>
  <div @resize="onResize">
    <NuxtLayout :name="layout">
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
    layout() {
      return this.appStore.isMobile ? 'default-mobile' : 'default';
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
        let baseWidth = 1440;

        if (wWidth < 1920) {
          baseWidth = wWidth * 0.75;
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
