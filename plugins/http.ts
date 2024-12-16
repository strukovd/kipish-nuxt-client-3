import { defineNuxtPlugin } from '#app';
import axios, { type AxiosInstance } from 'axios';

declare module '#app' {
  interface NuxtApp {
    $http: AxiosInstance;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $http: AxiosInstance;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const http: AxiosInstance = axios.create({
    baseURL:
      process.env.NODE_ENV === 'production'
        ? 'https://kipish.kg/api/v1'
        : 'http://localhost:8083/api/v1/',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    timeout: 180000,
  });

  // Добавляем в Nuxt App (доступ через nuxtApp.$http)
  nuxtApp.provide('http', http);

  // Проверяем наличие $http в глобальных свойствах Vue
  if (!('$http' in nuxtApp.vueApp.config.globalProperties)) {
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, '$http', {
      value: http,
      writable: false, // Делаем свойство неизменяемым
      configurable: false, // Запрещаем повторное определение
    });
  }
});
