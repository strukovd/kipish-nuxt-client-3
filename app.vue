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
    return {}
  },

  setup() {
    useHead({
      title: 'Кипиш — Медиа ресурс о светской и ночной жизни в Бишкеке',
      meta: [
        { name: 'description', content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.' },
        { name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения' },
        { property: 'og:title', content: 'Афиша мероприятий в Бишкеке: концерты, вечеринки, фестивали | Кипиш' },
        { property: 'og:description', content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://kipish.kg/' },
        { property: 'og:image', content: 'https://kipish.kg/logo-kipish.svg' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://kipish.kg/' },
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "http://schema.org/",
            "@type": "LocalBusiness",
            "name": "Kipish",
            "image": "https://kipish.kg/static/images/logo.svg",
            "telephone": "+996 504 443444",
            "url": "https://kipish.kg/",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "г. Бишкек, ул. Медерова 163/1",
              "addressLocality": "Bishkek",
              "addressRegion": "Chuy",
              "postalCode": "720005",
              "addressCountry": "Kyrgyzstan"
            },
            "sameAs": [
              "https://www.instagram.com/kipishkg/",
              "https://www.youtube.com/channel/UCaHkOh9c7dgps2aC4EbShSA"
            ]
          })
        },
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            "@context": "http://schema.org/",
            "@type": "WebSite",
            "url": "https://kipish.kg/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://kipish.kg/?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }
      ],
    })
  },

  methods: {
    setHead() {
      useHead({
        title: 'Кипиш — Медиа ресурс о светской и ночной жизни в Бишкеке',
        meta: [
          { name: 'description', content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.' },
          { name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения' },
          { property: 'og:title', content: 'Афиша мероприятий в Бишкеке: концерты, вечеринки, фестивали | Кипиш' },
          { property: 'og:description', content: 'Откройте для себя яркие события Бишкека: концерты, вечеринки, фестивали и культурные мероприятия. Найдите лучшие места и планируйте свой отдых с актуальной афишей на Кипише.' },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: 'https://kipish.kg/' },
          { property: 'og:image', content: 'https://kipish.kg/logo-kipish.svg' }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
          { rel: 'canonical', href: 'https://kipish.kg/' },
        ],
        script: [
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              "@context": "http://schema.org/",
              "@type": "LocalBusiness",
              "name": "Kipish",
              "image": "https://kipish.kg/static/images/logo.svg",
              "telephone": "+996 504 443444",
              "url": "https://kipish.kg/",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "г. Бишкек, ул. Медерова 163/1",
                "addressLocality": "Bishkek",
                "addressRegion": "Chuy",
                "postalCode": "720005",
                "addressCountry": "Kyrgyzstan"
              },
              "sameAs": [
                "https://www.instagram.com/kipishkg/",
                "https://www.youtube.com/channel/UCaHkOh9c7dgps2aC4EbShSA"
              ]
            })
          },
          {
            type: 'application/ld+json',
            children: JSON.stringify({
              "@context": "http://schema.org/",
              "@type": "WebSite",
              "url": "https://kipish.kg/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://kipish.kg/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }
        ],
      })
    },

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

    shouldShowScrollArrow() {
      // Если скрол в промежутке от 10% до 90%, то кнопка вверх\вниз будет показана
      const scrollPosition = window.scrollY;
      const documentHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;

      if (scrollPercentage > 90 || scrollPercentage < 10) {
        this.appStore.shouldShowScrollArrow = undefined;
      } else if (scrollPercentage < 70) {
        this.appStore.shouldShowScrollArrow = 'bottom';
      } else {
        this.appStore.shouldShowScrollArrow = 'top';
      }
    }
  },

  mounted() {
    this.setHead();
  },

  created() {
    if( import.meta.browser ) {
      this.initGlobalProperties();

      window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
          document.body.classList.add('scrolled'); // Добавляем класс, если страница прокручена
          this.shouldShowScrollArrow();
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
