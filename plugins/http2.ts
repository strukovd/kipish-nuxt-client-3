import { defineNuxtPlugin } from '#app';
import axios, { type AxiosInstance } from 'axios';

declare module '#app' {
  interface NuxtApp {
    $http2: AxiosInstance;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http2: AxiosInstance;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const http2: AxiosInstance = axios.create({
    baseURL:
      process.env.NODE_ENV === 'production'
        ? 'https://kipish.kg/api/v2'
        : 'http://localhost:8083/api/v2/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 180000,
  });

  // Добавляем в Nuxt App (доступ через nuxtApp.$http2)
  nuxtApp.provide('http2', http2);

  // Проверяем наличие $http2 в глобальных свойствах Vue
  if (!('$http2' in nuxtApp.vueApp.config.globalProperties)) {
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, '$http2', {
      value: http2,
      writable: false, // Делаем свойство неизменяемым
      configurable: false, // Запрещаем повторное определение
    });
  }
});
