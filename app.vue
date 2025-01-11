<template>
  <div v-show="isServer" class="loadingScreen">
    <img class="logo" src="/images/logo-kipish.svg" alt="Logo">
  </div>
  <div v-show="!isServer" @resize="onResize">
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
    isServer() {
      return !import.meta.client;
    },

    layout() {
      return this.appStore.isMobile ? 'default-mobile' : 'default';
    }
  },

  watch: {
    'appStore.isDark'() {
      if( !import.meta.browser ) return;

      if(this.appStore.isDark) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('dark-theme', String(this.appStore.isDark));
      }
      else {
        document.body.classList.remove('dark-theme');
        localStorage.removeItem('dark-theme');
      }
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
      if(localStorage.getItem('dark-theme') === 'true') this.appStore.isDark = true;
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
.loadingScreen {
  height:100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin:auto;
  padding:0 20vw;
	animation: pulse 2s infinite ease-out;

	/* pulse animation */
	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.3;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.logo {
		padding:0 1em;
		margin-bottom:.6em;
		max-height: 150px;
	}
}

.modal-enter-active, .modal-leave-active {
  transition:opacity .2s ease-in 0s;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
