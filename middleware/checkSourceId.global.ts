export default defineNuxtRouteMiddleware(async (to, from) => {
  let sourceUrl;
  if(to.path.startsWith('/report/')) sourceUrl = `/url/album/${to.params.key}`;
  else if(to.path.startsWith('/establishment/')) sourceUrl = `/url/establishment/${to.params.key}`;
  else if(to.path.startsWith('/event/')) sourceUrl = `/url/event/${to.params.key}`;


  const key = String(to.params.key);
  const appStore = useAppStore();
  if(sourceUrl) {
    const $http: any = useNuxtApp().$http;
    try {
      if (key && /^\d+$/.test(key) ) { // Если path — это число
        appStore.sourceId = to.path;
      } else { // Если path — это ЧПУ строка
        const response = await $http.get(sourceUrl);
        if (response.data) {
          appStore.sourceId = response.data.sourceId;
        } else {
          console.error('404');
          return navigateTo('/404');
        }
      }
    } catch (error) {
      console.error(error);
      // return navigateTo('/404');
    }
  }

});
