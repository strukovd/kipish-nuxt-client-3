import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    globalErrorMessage: {},
    videoDomain: process.env.NODE_ENV === 'production' ? '/api/v1/reports/video/stream/' : 'http://localhost:8083/api/v1/reports/video/stream/',
    windowWidth: 0,
    redirects: [],
    redirectsMap: null,
    isMobile: false,
    currentCity: import.meta.browser ? JSON.parse(localStorage.getItem('city') ?? 'null') : {"id":1,"nameRu":"Бишкек","nameKg":"Бишкек","nameEn":"Bishkek","visible":true},
    sourceId: import.meta.browser ? JSON.parse(localStorage.getItem('sourceId') ?? 'null') : null,
    errorMessages: [],
    isDark: false
  }),
  actions: {}
})


if(import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
