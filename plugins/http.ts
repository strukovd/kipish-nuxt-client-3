import type { App } from 'vue';
import axios, { type AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$http: AxiosInstance;
	}
}


const httpPlugin = {
	install(app: App) {
		const http: AxiosInstance = axios.create({
			baseURL:
			process.env.NODE_ENV === 'production'
				? 'https://kipish.kg/api/v1'
				: 'http://localhost:8083/api/v1/',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			timeout: 180000
		});

		app.config.globalProperties.$http = http;
	}
};


export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(httpPlugin);
});
