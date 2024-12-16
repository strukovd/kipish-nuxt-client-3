export default defineNuxtRouteMiddleware(async (to, from) => {
  // if (import.meta.server) return;
  // if (import.meta.client) return;
  const nuxtApp = useNuxtApp();
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return;

  console.log(`${to.path} - ${to.params.key}`);


  let sourceUrl;
  if(to.path.startsWith('/report/')) sourceUrl = `/url/album${to.params.key}`;
  else if(to.path.startsWith('/establishment/')) sourceUrl = `/url/establishment${to.params.key}`;
  else if(to.path.startsWith('/event/')) sourceUrl = `/url/event${to.params.key}`;


  const key = String(to.params.key);
  const appStore = useAppStore();

  if(sourceUrl) {
    const $http: any = useNuxtApp().$http;
    if (!$http) {
      console.error('Axios instance is not available');
      return;
    }

    try {
      if (key && /^\d+$/.test(key) ) { // Если path — это число
        appStore.sourceId = to.path;
      } else { // Если path — это ЧПУ строка
        const response = await $http.get(`/url/album/${key}`);
        if (response.data) {
          appStore.sourceId = response.data.sourceId;
        } else {
          console.error('404');
          // return navigateTo('/404');
        }
      }
    } catch (error) {
      console.error(error);
      // return navigateTo('/404');
    }
  }

});
