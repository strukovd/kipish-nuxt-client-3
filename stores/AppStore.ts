import { defineStore } from 'pinia';
import type { ModalModel } from '~/plugins/modal';

export const useAppStore = defineStore('app', {
  state: () => ({
    // TODO: нужны ли эти свойства?
    globalErrorMessage: {},
    redirects: [],
    redirectsMap: null,
    errorMessages: [],

    videoDomain: process.env.NODE_ENV === 'production' ? '/api/v1/reports/video/stream/' : 'http://localhost:8083/api/v1/reports/video/stream/',
    windowWidth: 0,
    isMobile: false,
    currentCity: import.meta.browser ? JSON.parse(localStorage.getItem('city') ?? 'null') : {"id":1,"nameRu":"Бишкек","nameKg":"Бишкек","nameEn":"Bishkek","visible":true},
    sourceId: import.meta.browser ? JSON.parse(localStorage.getItem('sourceId') ?? 'null') : null,
    isDark: false,
    modals: [] as ModalModel[],
    links: [
      {href: '/reports',                title: 'Фото',              icon: 'mdi-camera'},
      {href: '/videos',                 title: 'Видео',             icon: 'mdi-video'},
      {href: '/events',                 title: 'События',           icon: 'mdi-calendar'},
      {href: '/establishments',         title: 'Заведения',         icon: 'mdi-glass-wine'},
      {onClick: 'scrollToBottom',       title: 'Контакты',          icon: 'mdi-phone-message'},
      {href: '/feedback',               title: 'Заказать съемку',   icon: 'mdi-video-marker'},
      // {href: '/news',                                  title: 'Новости',           icon: 'mdi-camera'},
    ],
  }),
  actions: {
    scrollToBottom() {
      if(!import.meta.client) return;
      const destinationElement = document.body;
      if (destinationElement) {
        window.scrollTo({
          top: document.body.offsetHeight,
          behavior: 'smooth'
        });
      }
    },

    handleLinkClick(link: { href?: string; onClick?: string }) {
      if (link.onClick && typeof (this as any)[String(link.onClick)] === 'function') {
        (this as any)[String(link.onClick)]();
      }
    },

  }
})


if(import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
