<template>
  <div class="error-page">
    <h1 class="h1-font" style="font-size:5vw; line-height:1.2em; margin:2em 0 .4em 0;">404 - Страница не найдена</h1>
    <p class="h2-font">Эта страница не существует, проверьте URL или вернитесь на главную.</p>
    <br>
    <br>
    <NuxtLink to="/">Вернуться на главную</NuxtLink>
  </div>
</template>

<script>
definePageMeta({
  title: '404 - Страница не найдена',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ]
})
</script>

<style scoped>
.error-page {
  text-align: center;
  margin: 50px;
  font-family: Arial, sans-serif;
}

</style>
