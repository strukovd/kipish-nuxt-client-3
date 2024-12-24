<template>
	<div class="report-desktop mid">
		<BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/reports', title: 'Все репортажи'}, {href: '', title: model.name}]"/>
    <section class="row">
      <h1 class="report-name h1-font text-68 font-title">{{ model.name }} - Фотоотчет</h1>
      <div>
        <template v-if="model.albumDate">
          <span class="report-date">{{ formatDate(model.albumDate) }}</span>
          <span class="report-year">{{ formatDateForYear(model.albumDate) }}</span>
        </template>
      </div>
    </section>

    <section class="row">
      <div style="display:flex; gap:1.4em;">
        <button @click="downloadZip" class="button-v1">Скачать весь отчет</button>
        <button class="button-v1">
          <heroicon name="share" stroke="currentColor" fill="transparent" width="16px" height="16px"/>

          <!-- <div style="display:flex; position:absolute; top:0; right:-50%;">
              <v-btn @click="shareOnWhatsApp" dark fab bottom color="green" small>
                <v-icon>mdi-whatsapp</v-icon>
              </v-btn>
              <v-btn @click="shareOnFacebook" dark fab bottom color="blue" small>
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn @click="shareOnTwitter" dark fab bottom color="0088cc" small>
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <v-btn @click="shareOnTelegram" dark fab bottom color="blue" small>
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                  <path d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" fill="white"/>
                </svg>
              </v-btn>
          </div> -->
        </button>
      </div>
      <div class="report-info-container">
        <div v-if="Array.isArray(model.photographers) && model.photographers.length" class="report-info">
          <span class="report-info-name">Фотограф</span>
          <span class="report-info-value font-title">{{ model?.photographers[0]?.fullName }}</span>
        </div>
        <div v-if="model?.views" class="report-info">
          <span class="report-info-name">Просмотров</span>
          <span class="report-info-value font-title">{{ model?.views }}</span>
        </div>
        <div class="report-info">
          <span class="report-info-name">Фото</span>
          <span class="report-info-value font-title">{{ totalFilesCounter ?? '0' }}</span>
        </div>
      </div>
    </section>

    <section>
      <v-card-text class="pa-0 mt-80">
        <div>
          <MasonryInfiniteGrid aria-sort="ascending" v-bind:gap="8" @renderComplete="()=>{}" @requestPrepend="()=>{}" @requestAppend="onRequestAppend">
            <div class="cursor-pointer image_item"
              v-for="(file, id) of allFiles" :key="file.id" :data-grid-groupkey="file.groupKey"
            >
            <img
              loading="lazy"
              class="image-watermark-image"
              @load="getImageSize(file)"
              @click="openImageDialog(file.id)"
              data-aos="fade-up"
              data-aos-duration="1000"
              width="428"
              :ref="'image_' + file.id"
              alt=""
              style="border-radius: 16px"
              :src="`https://files.kipish.kg/${file.minioBucket}/min-${file.minioPath}`"/>
                  </div>

            <div v-if="loadingMore" class="cursor-pointer image_item" v-for="num of 6" :key="num" data-grid-groupkey="preloader">
              <v-skeleton-loader type="image" width="428" :height="Math.random() * (640 - 285) + 285"/>
            </div>
          </MasonryInfiniteGrid>
        </div>
      </v-card-text>
    </section>



    <!-- PREVIEW MODAL -->
  <v-dialog overlay-opacity="0.4" eager overlay-color="#000000"
      style="z-index: 999999 !important;overflow: visible !important"
      v-model="dialog" max-width="1300">
  <div style="position: relative;">
    <v-carousel style="overflow: visible !important;" :height="appStore.windowWidth <= 1920 ? '650' : '730'" v-model="viewedImageId" hide-delimiters class="d-flex justify-center">
    <v-carousel-item class="px-16"
      style="border-radius:24px !important;width:1100px !important;overflow:visible !important; position:relative;"
      v-for="(file, index) of files" :key="file.id"
    >
      <div class="d-flex justify-center align-center ma-auto mt-2"
        :class="file.orientation === 'vertical' ? 'image_container_vertical' : 'image_container_horizontal'"
      >

      <div v-if="showSharePhoto" class=" d-flex"
          style="display:flex;justify-content:center; position:absolute;left:0;right:0;bottom:1em;z-index:9999;"
      >
        <div style="background-color:#FFFFFF55; border-radius:8px; padding:.3em;">
        <v-btn @click="shareImage(`whatsapp`)" class="mx-2" dark fab bottom color="green" small>
          <v-icon>mdi-whatsapp</v-icon>
        </v-btn>
        <v-btn @click="shareImage(`facebook`)" class="mx-2" dark fab bottom color="blue" small>
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn @click="shareImage(`twitter`)" class="mx-2" dark fab bottom color="0088cc" small>
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn @click="shareImage(`telegram`)" class="mx-2" dark fab bottom color="blue" small>
          <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
          <path
            d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
            fill="white"/>
          </svg>
        </v-btn>
        </div>
      </div>

      <img alt=""
        class="image-watermark-image"
        :class="file.orientation === 'vertical' ? 'vertical' : 'horizontal'"
        :key="file.id"
        :src="`https://files.kipish.kg/${file.minioBucket}/min-${file.minioPath}`"
        style="border-radius: 24px !important;"/>
      <div class="button-container">
        <v-btn depressed style="border-radius: 50% !important" fab class="pa-5 hover-red" color="#FE252E"
            @click="dialog = false">
        <v-icon color="white">mdi-close</v-icon>
        </v-btn>
      </div>
      </div>
      <div class="pa-5 d-flex justify-center">
      <v-btn depressed @click="downloadImage(file.id)" style="border-radius: 16px !important;"
          color="#FFFFFF4D"
          class="py-8 px-15 mr-4 hover-red">
        <span class="text-20 white--text opacity-70">Скачать</span>
      </v-btn>
      <v-btn depressed @click="showSharePhoto = !showSharePhoto"
          style="width:auto; border-radius: 16px !important;" color="#FFFFFF4D"
          class="py-8 hover-red">
        <heroicon name="share" stroke="#DFCDDD" fill="transparent"/>
      </v-btn>
      </div>
    </v-carousel-item>
    <!-- <template v-slot:prev="{on, attrs}">
      <v-btn depressed :disabled="viewedImageId === 0" v-bind="attrs" v-on="on" class="py-8 px-1"
          style="border-radius: 16px !important;" color="#FFFFFF4D">
      <v-img width="40" height="40" src="/static/images/icons/ArrowLeft.svg"/>
      </v-btn>
    </template>
    <template v-slot:next="{on, attrs}">
      <v-btn depressed :disabled="viewedImageId === files.length - 1" v-bind="attrs" v-on="on"
          class="py-8 px-1"
          style="border-radius: 16px !important;" color="#FFFFFF4D">
      <v-img width="40" height="40" src="/static/images/icons/ArrowRight.svg"/>
      </v-btn>
    </template> -->
    </v-carousel>
  </div>
  </v-dialog>

  </div>
</template>

<script lang="ts">
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import 'swiper/swiper.min.css';
import { MasonryInfiniteGrid, FrameInfiniteGrid } from "@egjs/vue3-infinitegrid";
import BaseBreadcrumbs from '~/components/common/BaseBreadcrumbs.vue';
import { mapStores } from 'pinia';


export default defineComponent({
	name: "ReportDesktop",
	components: { SwiperSlide, Swiper, MasonryInfiniteGrid, FrameInfiniteGrid, BaseBreadcrumbs },

	// head() {
	//	 return {
	//		 title: this.metaTitle,
	//		 meta: [
	//			 { property: 'og:title', content: this.metaTitle },
	//			 { name: 'description', content: this.metaDescription },
	//			 { property: 'og:description', content: this.metaDescription },
	//			 { name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения' },
	//			 { property: 'og:type', content: 'website' },
	//			 { property: 'og:url', content: 'https://www.kipish.kg/' },
	//			 { property: 'og:image', content: 'https://www.kipish.kg/image.jpg' }
	//		 ],
	//		 link: [
	//			 {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'},
	//			 {rel: 'canonical', href: 'https://kipish.kg/reports/'}
	//		 ],
	//	 };
	// },

	data() {
		return {
			dialShare: false,
			showSharePhoto: false,
			show: false,
			selectedImage: null as any,
			days: [] as any[],
			model: {} as any,
			dialog: false,
			loading: false,
			loadingContent: false,
			notFound: false,
			items: [] as any[],
			page: 0,
			size: 6,
			pagesIsOver: false,
			files: [] as any[],
			processedFiles: [] as any[],
			fileLoading: false,
			totalFilesCounter: 0,
			viewedImageId: 0,
			shareDialog: false,
			loadingMore: false,
			watermark: null as any,
			_metaTitle: '',
			_metaDescription: '',
		}
	},

	watch: {
		viewedImageId(id: any) {
			// Если просматриваемая фотография одна из последних, подгружаем еще
			if (id === this.files.length - 3 && !this.pagesIsOver) {
				this.loadMore();
			}
		},

		dialog(newVal: any, oldVal: any) {
			// Вещаем обработчик нажатия на стрелки
			if (newVal && newVal !== oldVal) {
				document.addEventListener('keydown', this.onKeydown);
			} else if (!newVal && newVal !== oldVal) {
				document.removeEventListener('keydown', this.onKeydown);
			}
		}
	},

	computed: {
		...mapStores( useAppStore ),
		allFiles(): any[] {
			let newFiles = this.files.filter((file: any) => file.hasOwnProperty('file') && !this.processedFiles.some((f: any) => f.id === file.id));
			if (newFiles.length > 0) {
				newFiles.forEach(file => {
					this.processedFiles.push(file);
				});
			}
			return this.processedFiles.sort((a: any, b: any) => (a.fileOrder || 0) - (b.fileOrder || 0));
		},

		metaTitle(): any {
			if(!this.model || !this.model?.name) return '';

			// return '';

			if(!this._metaTitle) {
				return this.model.name ? (this.model.establishment?.name ? `${this.model.establishment?.name} — ${this.model.name} | Кипиш` : `${this.model.name} | Кипиш`) : 'Кипиш'
			}
			else {
				return this._metaTitle;
			}
		},

		metaDescription(): any {
			if(!this.model || !this.model?.name) return '';

			if(!this._metaDescription) {
				return this.model?.name && this.model?.establishment?.name ? `Фотоотчет с ${this.model.name} в ${this.model.establishment?.name}. Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.` : 'Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.'
			}
			else {
				return this._metaDescription;
			}
		}
	},

	mounted() {
		this.getFiles();
		this.addViews();
		this.initOnScrollFetcher();
	},

	methods: {
		fetchSeo() {
			this.$http.get(`/seo/friendly-url/${this.appStore.sourceId}/album`)
				.then(res => {
					const urlInfo = res.data;
					if( urlInfo ) {
						if( urlInfo.metaTitle ) this._metaTitle = urlInfo.metaTitle;
						if( urlInfo.metaDescription ) this._metaDescription = urlInfo.metaDescription;
					}
				})
		},

		onKeydown(e: any) {
			// arrow left and right
			if (e.key === 'ArrowLeft') {
				if (this.viewedImageId === 0) this.viewedImageId = this.files.length - 1;
				else this.viewedImageId--;
			} else if (e.key === 'ArrowRight') {
				if (this.viewedImageId === this.files.length - 1) this.viewedImageId = 0;
				else this.viewedImageId++;
			}
		},

		onRequestAppend(e: any) {
			const nextGroupKey = (e.groupKey || 0) + 1;
			const length = this.files.length;

			this.items = [
				...this.files,
				{groupKey: nextGroupKey, key: length},
				{groupKey: nextGroupKey, key: length + 1},
				{groupKey: nextGroupKey, key: length + 2},
				{groupKey: nextGroupKey, key: length + 3},
				{groupKey: nextGroupKey, key: length + 4},
				{groupKey: nextGroupKey, key: length + 5},
			];
		},

		initOnScrollFetcher() {
			window.onscroll = () => {
				if (!this.pagesIsOver && !this.loadingContent && !this.loadingMore) {
					let halfWindowHeight = window.innerHeight / 2;
					let bottomOfWindow = document.documentElement.scrollTop + halfWindowHeight >= document.documentElement.offsetHeight - 5000;
					if (bottomOfWindow) {
						this.loadMore();
					}
				}
			};
		},

		shareImage(destination: any) {
			const image = this.files.find((el, index) => index === this.viewedImageId);
			let baseUrl = '';

			if (process.env.NODE_ENV === 'production') {
				baseUrl = 'https://kipish.kg/image';
			} else {
				baseUrl = 'http://localhost:8084/image';
			}

			const imageUrl = `${baseUrl}/${image.id}`;

			let shareUrl;
			let curUrl = window.location.href;

			switch (destination) {
				case 'whatsapp':
					shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(imageUrl)}`;
					break;
				case 'telegram':
					shareUrl = `https://t.me/share/url?url=${encodeURIComponent(imageUrl)}`;
					break;
				case 'facebook':
					shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
					break;
				case 'twitter':
					let shareText = 'Kipish.kg';
					shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(shareText)}`;
					break;
			}

			window.open(shareUrl, '_blank');
		},

		getImageSize(item: any) {
			const image: any = this.$refs['image_' + item.id];
			this.$nextTick(() => {
				if (image) {
					this.files.find(file => file.id === item.id).orientation = image[0].naturalWidth > image[0].naturalHeight ? 'horizontal' : 'vertical';
				}
			});
			// this.addWatermark(item);
		},

		addViews() {
			this.$http.put(`/albums/${this.appStore.sourceId}/views`);
		},

		shareOnFacebook() {
			const url = window.location.href;
			const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
			window.open(shareUrl, '_blank');
		},
		shareOnTwitter() {
			const url = window.location.href;
			const shareText = 'Текст для шаринга'; // Замените на ваш текст
			const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
			window.open(shareUrl, '_blank');
		},
		shareOnInstagram() {
			const url = window.location.href;
			const shareUrl = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;
			window.open(shareUrl, '_blank');
		},
		shareOnVKontakte() {
			const url = window.location.href;
			const shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}`;
			window.open(shareUrl, '_blank');
		},
		shareOnTelegram() {
			const url = window.location.href;
			const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}`;
			window.open(shareUrl, '_blank');
		},
		shareOnLinkedIn() {
			const url = window.location.href;
			const shareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}`;
			window.open(shareUrl, '_blank');
		},
		shareOnPinterest() {
			const url = window.location.href;
			const imageUrl = 'image-url';
			const shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}`;
			window.open(shareUrl, '_blank');
		},
		shareOnWhatsApp() {
			const url = window.location.href;
			const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
			window.open(shareUrl, '_blank');
		},

		async loadMore() {
			this.loadingMore = true;
			const params = {
				page: this.page,
				size: this.size,
				isCover: false,
				sort: 'file_order,asc'
			};

			this.$http2.get(`/albums/${this.appStore.sourceId}/files`, {params})
				.then(r => {
					if (r.data.totalPages - 1 === this.page) this.pagesIsOver = true;
					if (!r.data.content.length) return;

					this.totalFilesCounter = r.data.totalElements;
					this.page++;
					this.files = this.files.concat(r.data.content);
				})
				.finally(() => {
					this.loadingMore = false;
				});
		},

		downloadZip() {
			// this.fileLoading = true
			// this.$fileHttp.get('/albums/download/zip', {
			// 	params: {id: this.appStore.sourceId},
			// 	responseType: 'arraybuffer'
			// })
			// 	.then((response: any) => {
			// 		try {
			// 			const blob = new Blob([response.data], {type: 'application/zip'});
			// 			const url = window.URL.createObjectURL(blob);
			// 			const a = document.createElement('a');
			// 			a.style.display = 'none';
			// 			a.href = url;
			// 			a.download = `отчёт-${this.model.name}.zip`;
			// 			document.body.appendChild(a);
			// 			a.click();
			// 			window.URL.revokeObjectURL(url);
			// 			this.fileLoading = false
			// 		} catch (error) {
			// 			console.error('Ошибка при обработке данных:', error);
			// 			this.fileLoading = false
			// 		}
			// 	})
			// 	.catch((error: any) => {
			// 		console.error('Ошибка при загрузке файла:', error);
			// 		this.fileLoading = false
			// 	});
		},

		downloadImage(id: any) {
			const file = this.files.find(file => file.id === id);
			const url = `https://files.kipish.kg/${file.minioBucket}/min-${file.minioPath}`;
			const filename = `${file.id}.jpg`;

			fetch(url)
				.then(response => response.blob())
				.then(blob => {
					const link = document.createElement("a");
					link.href = URL.createObjectURL(blob);
					link.download = filename;
					link.click();
				})
				.catch(console.error);
		},

		openImageDialog(imageId: any) {
      console.log(`suka`);
      console.log(imageId);

			const index = this.files.findIndex(file => file.id === imageId);
			if (index !== -1) {
				this.viewedImageId = index;
				this.dialog = true;
			} else {
				console.warn('Элемент с imageId', imageId, 'еще не доступен');
			}
		},

		formatDate(dateString: any) {
			const [day, month, year] = dateString.split('-');
			const formattedDate = `${year}-${month}-${day}`;
			const date = new Date(formattedDate);

			if (isNaN(date.getTime())) {
				return 'Неверная дата';
			}

			const options: any = {day: 'numeric', month: 'long'};
			return date.toLocaleDateString('ru-RU', options);
		},

		formatDateForYear(dateString: any) {
			const [day, month, year] = dateString.split('-');
			const formattedDate = `${year}-${month}-${day}`;
			const date = new Date(formattedDate);

			if (isNaN(date.getTime())) {
				return 'Неверная дата';
			}

			return date.getFullYear().toString();
		},

		fetchReport(id: any) {
			this.loading = true
			this.$http2.get(`/albums/${id}`)
				.then(r => {
					if( !Array.isArray(r.data.content) || !r.data.content[0] ) this.notFound = true;
					else {
						this.model = r.data.content[0];
					}
				})
				.catch(e => {
					console.log(e.message)
					this.loading = false
				})
		},

		getFiles() {
			this.files = [];
			this.page = 0;
			this.pagesIsOver = false;
			this.loadMore();
			this.loading = true;
		},
	},

	created() {
		// пример подставленного sourceId
		this.fetchReport(this.appStore.sourceId)
		this.fetchSeo();
	}
});
</script>


<style lang="scss">
.report-desktop {
  .row {
    padding:0;
    margin-top:60px;
    display:flex;
    justify-content:space-between;
    align-items: end;
  }

  .report-name {
    width: 900px;
    font-weight:300;
    text-transform: uppercase;
  }
  .report-date {
    font-size: 28px;
    text-transform: uppercase;
    padding-right: 20px;
    border-right: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  }
  .report-year {
    opacity: 0.7;
    font-size: 20px;
    margin-left: 20px;
  }

  .report-info-container {
    display: flex;

    .report-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding:20px 40px;

      &:not(:last-child) {
        // border-right:1px solid currentColor
        border-right:1px solid color-mix(in srgb, currentColor 20%, transparent);
      }

      .report-info-name {
        font-size: 20px;
        font-weight:300;
        opacity: 0.7;
        margin-bottom: 20px;
      }
      .report-info-value {
        font-size: 24px;
        font-weight:300;
        text-transform: uppercase;
      }
    }
  }
}



.image_item {
	border-radius: 16px;
	width: 428px;
	overflow: hidden;
	margin: 0 auto;

	.aos-init {
		transition: 0.5s all ease-in-out;
	}

	.aos-init:hover {
		transform: scale(1.2);
	}
}


.v-window__prev {
	background: none !important;
}

.v-window__next {
	background: none !important;
}

.v-overlay__scrim {
	backdrop-filter: blur(20px) !important;
	-webkit-backdrop-filter: blur(20px) !important;
}

.desktop_report_page {
	.v-overlay--active {
		backdrop-filter: blur(20px) !important;
		-webkit-backdrop-filter: blur(20px) !important;
	}

	.v-skeleton-loader__image {
		// height: 250px !important;
		border-radius: 16px !important;
	}
}

.skeleton_block {
	.card {
		margin-right: 32px;
		margin-bottom: 32px;
	}

	.card:nth-child(3n) {
		margin-right: 0;
	}

	.card:nth-last-child(-n+3) {
		margin-bottom: 0;
	}
}

.reports_block {
	display: flex;
	flex-wrap: wrap;

	.social-icons {
		position: absolute;
		bottom: 100px;
		right: 0;
	}

	.social-icons v-btn {
		margin: 5px;
	}

	.reports_block__card {
		margin-right: 32px;
		margin-bottom: 32px;
	}

	.reports_block__card:nth-child(3n) {
		margin-right: 0;
	}

	.reports_block__card:nth-last-child(-n+3) {
		margin-bottom: 0;
	}
}

.active_button {
	background: #FE252E !important;

	svg {
		stroke: white !important;
	}
}

.custom_button_dark {
	width: 80px;
	height: 80px;
	border-radius: 16px;
	border: 1px solid white;

	&:hover {
		cursor: pointer;
		background: #FE252E;

		svg {
			stroke: white !important;
		}
	}
}

.custom_button_light {
	width: 80px;
	height: 80px;
	border-radius: 16px;
	border: 1px solid rgba(0, 0, 0, 0.30);

	&:hover {
		cursor: pointer;
		background: #FE252E;

		svg {
			stroke: white !important;
		}
	}
}

.wrapper {
	width: 1440px !important;
	margin: 0 auto;
}

.v-dialog {
	box-shadow: none !important;
}

.blur {
	filter: blur(10px);
}

.image_container_vertical {
	position: relative !important;
	max-width: 460px !important;

	.button-container {
		position: absolute;
		top: -7px;
		right: -10px;
	}
}

.image_container_horizontal {
	position: relative !important;
	max-width: 1200px !important;

	.button-container {
		position: absolute;
		top: -7px;
		right: 20px;
	}
}


.vertical {
	height: 620px !important;
	width: 440px !important;
}

.horizontal {
	height: 600px !important;
	width: 900px !important;
}

@media screen and (max-width: 1920px) {
	.image_container_vertical {
		position: relative !important;
		max-width: 380px !important;

		.button-container {
			position: absolute;
			top: -7px;
			right: -10px;
		}
	}

	.image_container_horizontal {
		position: relative !important;
		max-width: 850px !important;

		.button-container {
			position: absolute;
			top: -7px;
			right: 20px;
		}
	}


	.vertical {
		max-height: 550px !important;
		max-width: 400px !important;
	}

	.horizontal {
		height: 550px !important;
		width: 800px !important;
	}
}
</style>
