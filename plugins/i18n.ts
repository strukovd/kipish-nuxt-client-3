import { createI18n } from 'vue-i18n';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import kg from '../locales/kg.json';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'ru',
    messages: {
      en,
      ru,
      kg,
    },
  });

  vueApp.use(i18n)
});
