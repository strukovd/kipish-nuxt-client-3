<template>
  <div v-if="loading" class="loadingScreen">
    <img class="logo" src="/images/logo-kipish.svg" alt="Logo">
  </div>
  <section v-else>
    <div v-if="!customPage" class="error-page">
      <h1 class="h1-font" style="font-size:5vw; line-height:1.2em; margin:2em 0 .4em 0;">404 - Страница не найдена</h1>
      <p class="h2-font">Эта страница не существует, проверьте URL или вернитесь на главную.</p>
      <br>
      <br>
      <NuxtLink to="/">Вернуться на главную</NuxtLink>
    </div>
    <CustomPage v-else />
  </section>
</template>

<script setup lang="ts">
import CustomPage from './CustomPage.vue';

const route = useRoute();
const { data: pages, pending: loading, error } = await useAsyncData('pages', () =>
  $fetch('/pages/keys')
);

const customPage = computed(() => {
  if (error.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
  }
  return pages.value?.includes(route.path.replace('/', ''));
});

useHead({
  title: customPage.value ? 'Custom Page' : '404 - Страница не найдена',
  meta: customPage.value
    ? []
    : [{ name: 'robots', content: 'noindex, nofollow' }],
});
</script>

<style scoped>
.error-page {
  text-align: center;
  margin: 50px;
  font-family: Arial, sans-serif;
}
</style>
