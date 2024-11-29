import type { App } from 'vue';
import axios, { type AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$http2: AxiosInstance;
	}
}


const http2Plugin = {
	install(app: App) {
		const http2: AxiosInstance = axios.create({
			baseURL:
			process.env.NODE_ENV === 'production'
				? 'https://kipish.kg/api/v2'
				: 'http://localhost:8083/api/v2/',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			timeout: 180000
		});

		app.config.globalProperties.$http2 = http2;
	}
};


export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(http2Plugin);
});
