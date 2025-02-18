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
    <CustomPage v-else/>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CustomPage from './CustomPage.vue';
import { mapStores } from 'pinia';

export default defineComponent({
  components: { CustomPage },
  computed: {
    ...mapStores( useAppStore ),
  },

  data() {
    return {
      loading: true,
      customPage: false,
    };
  },
  methods: {},

  beforeCreate() {
    const route = useRoute();
    const router = useRouter();

    const r = this.$http.get(`pages/keys`)
      .then(r => {
        this.appStore.pages = r.data;

        const pathKey = route.path.replace('/', '');
        if ( this.appStore.pages.includes(pathKey) ) {
          this.customPage = true;
          // router.replace({ path: route.path });
        } else {
          definePageMeta({
            title: '404 - Страница не найдена',
            meta: [
              { name: 'robots', content: 'noindex, nofollow' },
            ],
          });

          throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
        }
      })
      .finally(() => {
        this.loading = false;
      });

  }
});
</script>

<style scoped>
.error-page {
  text-align: center;
  margin: 50px;
  font-family: Arial, sans-serif;
}

</style>
