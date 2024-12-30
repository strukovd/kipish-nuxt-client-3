<template>
  <div class="report-mobile mmid3">
    <!-- BREADCRUMBS -->
		<BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/reports', title: 'Репортажи'}, {href: '', title: model.name}]"/>
    <BaseTitle type="mobile" style="margin-bottom:.6em;">
      <h1>{{ model.name }} - Фотоотчет</h1>
    </BaseTitle>

    <!-- INFO -->
    <section class="report-info">
      <div class="report-info-item">
        <div class="report-info-name">Фотограф</div>
        <div v-if="Array.isArray(model.photographers) && model.photographers.length" class="report-info-value font-title">{{ model?.photographers[0]?.fullName }}</div>
      </div>
      <div class="report-info-item">
        <div class="report-info-name">Просмотров</div>
        <div class="report-info-value font-title">{{ model?.views }}</div>
      </div>
      <div class="report-info-item">
        <div class="report-info-name">Фото</div>
        <div class="report-info-value font-title">{{ totalFilesCounter ?? '0' }}</div>
      </div>
    </section>

    <!-- BUTTON -->
    <ClientOnly>
      <section>
        <BaseButton @click="downloadZip" class="report-button" color="primary" style="margin-bottom:1em;">Скачать весь отчет</BaseButton>
      </section>
    </ClientOnly>

    <!-- GALLERY -->
    <section class="report-gallery">
      <masonry-infinite-grid
        class="masonry-grid"
        :gap="8"
        align="center"
        column="2"
        v-on:requestAppend="onRequestAppend">
        <div v-for="file of files"
          :key="file.key" :data-grid-groupkey="file.groupKey"
        >
          <img
            class="image-watermark-image"
            data-aos="fade-up"
            data-aos-duration="1000"
            @load="getImageSize(file)"
            :style="appStore.windowWidth > 1024 && 'maxWidth: 480px' || appStore.windowWidth > 1000 && 'maxWidth: 380px' || appStore.windowWidth > 800 && 'maxWidth: 370px' || appStore.windowWidth > 600 && 'maxWidth: 280px' || appStore.windowWidth > 500 && 'maxWidth: 220px' || appStore.windowWidth > 400 && 'maxWidth: 190px' || appStore.windowWidth >= 375 && 'maxWidth: 175px' || appStore.windowWidth > 340 && 'maxWidth: 150px' || appStore.windowWidth > 300 && 'maxWidth: 150px'"
            style="border-radius:16px;"
            :src="`https://files.kipish.kg/${file.minioBucket}/min-${file.minioPath}`"

            :ref="'image_' + file.id"
            @click="openImageDialog(file.id)"
            alt=""
            />
        </div>
      </masonry-infinite-grid>
    </section>
  </div>
</template>

<script>
import { MasonryInfiniteGrid, FrameInfiniteGrid } from "@egjs/vue3-infinitegrid";
import { mapStores } from "pinia";
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";
import BaseButton from "~/components/common/BaseButton.vue";
import BaseTitle from "~/components/common/BaseTitle.vue";


export default {
  name: "ReportMobile",
  components: { BaseBreadcrumbs, BaseTitle, BaseButton, MasonryInfiniteGrid, FrameInfiniteGrid },
  metaInfo() {
    return {
      title: this.model.name ? (this.model.establishment?.name ? `${this.model.establishment?.name} — ${this.model.name} | Кипиш` : `${this.model.name} | Кипиш`) : 'Кипиш',
      meta: [
        {name: 'description', content: this.model?.name && this.model?.establishment?.name ? `Фотоотчет с ${this.model.name} в ${this.model.establishment?.name}. Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.` : 'Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.'},
        {name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения'},
        {property: 'og:title', content: this.model.name ? (this.model.establishment?.name ? `${this.model.establishment?.name} — ${this.model.name} | Кипиш` : `${this.model.name} | Кипиш`) : 'Кипиш',},
        {property: 'og:description', content: this.model?.name && this.model?.establishment?.name ? `Фотоотчет с ${this.model.name} в ${this.model.establishment?.name}. Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.` : 'Смотрите лучшие фото на Кипише — медиа ресурсе о светской жизни Бишкека.'},
        {property: 'og:type', content: 'website'},
        {property: 'og:url', content: 'https://www.kipish.kg/'},
        {property: 'og:image', content: 'https://www.kipish.kg/image.jpg'}
      ],
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'}
      ],
    };
  },
  data: () => ({
    shareDialog: false,
    showSharePhoto: false,
    imageIndex: '',
    selectedImage: null,
    days: [],
    model: {},
    dialog: false,
    loading: false,
    loadingContent: false,
    page: 0,
    size: 4,
    pagesIsOver: false,
    files: [],
    processedFiles: [],
    fileLoading: false,
    totalFilesCounter: 0,
    loadingMore: false,
    imageSrc: '/static/images/watermark.png',
    watermark: null,
    loaded: false
  }),
  computed: {
    ...mapStores( useAppStore ),
  },
  watch: {
    imageIndex(value) {
      if (value === this.files.length - 2) {
        this.loadMore()
      }
    }
  },
  mounted() {
    this.addViews();
    this.initOnScrollFetcher()
  },
  methods: {
    handleLoad() {
      this.loaded = true;
    },

    prevSlide() {
      this.selectedImage = this.files[this.imageIndex - 1];
      this.imageIndex = this.imageIndex - 1;
    },
    nextSlide() {
      this.selectedImage = this.files[this.imageIndex + 1];
      this.imageIndex = this.imageIndex + 1;
    },

    shareImage(destination) {
      const image = this.files.find((el, index) => index === this.imageIndex);
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

    getImageSize(item) {
      const image = this.$refs['image_' + item.id];
      this.$nextTick(() => {
        if (image) {
          this.$set(this.files.find(file => file.id === item.id), 'orientation', image[0].naturalWidth > image[0].naturalHeight ? 'horizontal' : 'vertical');
        }
      });
    },

    onRequestAppend(e) {
      const nextGroupKey = (e.groupKey || 0) + 1;
      const length = this.files.length;

      this.items = [
        ...this.files,
        {groupKey: nextGroupKey, key: length},
        {groupKey: nextGroupKey, key: length + 1},
        {groupKey: nextGroupKey, key: length + 2},
      ];
    },

    initOnScrollFetcher() {
      window.onscroll = () => {
        if (!this.loadingContent && !this.loadingMore) {
          let halfWindowHeight = window.innerHeight / 2;
          let bottomOfWindow = document.documentElement.scrollTop + halfWindowHeight >= document.documentElement.offsetHeight - 2000;
          if (bottomOfWindow) {
            this.loadingMore = true;
            this.loadMore();
          }
        }
      };
    },

    addViews() {
      this.$http.put(`/albums/${this.appStore.sourceId}/views`)
    },

    downloadZip() {
      this.fileLoading = true
      this.$fileHttp.get('/albums/download/zip', {
        params: {id: this.appStore.sourceId},
        responseType: 'arraybuffer'
      })
        .then(response => {
          try {
            const blob = new Blob([response.data], {type: 'application/zip'});
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `отчёт-${this.model.name}.zip`; // Укажите имя файла для скачивания
            document.body.appendChild(a);
            a.click(); // Кликаем на ссылку
            window.URL.revokeObjectURL(url); // Освобождаем ресурсы
            this.fileLoading = false
          } catch (error) {
            console.error('Ошибка при обработке данных:', error);
            this.fileLoading = false
          }
        })
        .catch(error => {
          console.error('Ошибка при загрузке файла:', error);
          this.fileLoading = false
        });
    },

    downloadImage(id) {
      console.log(id);
      const file = this.files.find(file => file.id === id);
      console.log(file);
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

    openImageDialog(imageId) {
      const index = this.files.findIndex(file => file.id === imageId);
      const selectedImage = this.files.find((file, index) => file.id === imageId);
      this.selectedImage = selectedImage ? selectedImage : null;
      if (index !== -1) {
        // this.imageIndex = index;
        // this.dialog = true;
        this.$modal.show('', 'ImageView', {payload: {files: this.files, index}});
      } else {
        console.warn('Элемент с imageId', imageId, 'еще не доступен');
      }
    },

    formatDate(dateString) {
      const [day, month, year] = dateString.split('-');
      const formattedDate = `${year}-${month}-${day}`;
      const date = new Date(formattedDate);

      if (isNaN(date.getTime())) {
        return 'Неверная дата';
      }

      const options = {day: 'numeric', month: 'long'};
      return date.toLocaleDateString('ru-RU', options);
    },

    fetchReport(id) {
      this.loading = true;
      this.$http2.get(`/albums/${id}`)
        .then(r => {
          if( !Array.isArray(r.data.content) ) throw new Error('Нет данных албома');
          this.model = r.data.content[0];
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
        })
    },

    getFiles() {
      this.files = [];
      this.page = 0;
      this.loadMore();
      this.loading = true
    },

    async loadMore() {
      this.loadingMore = true;
      const params = {
        page: this.page,
        size: this.size,
        isCover: false,
        sort: 'file_order,asc'
      };

      this.$http2.get(`/albums/${this.appStore.sourceId}/files`, { params })
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
  },
  created() {
    this.fetchReport(this.appStore.sourceId);
    this.getFiles();
  }
}
</script>


<style lang="scss">
.report-mobile {

  .report-info {
    display: flex;
    flex-direction: column;
    gap: .4em;

    .report-info-item {
      margin-bottom:.6em;

      .report-info-name {
        font-weight: 200;
        font-size:16px;
        margin-bottom:.6em;
      }

      .report-info-value {
        font-weight:300;
        font-size: 20px;
        margin-bottom:.6em;
      }

      &:not(:last-child) {
        border-bottom:1px solid color-mix(in srgb, currentColor 50%, transparent);
      }
    }
  }
}




.v-overlay__scrim {
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
}

.v-overlay--active {
  backdrop-filter: blur(20px) !important;
  -webkit-backdrop-filter: blur(20px) !important;
}

.report_img_container {
  .v-image {
    overflow: visible !important;
  }

  .image_container_vertical {
    position: relative !important;

    .button-container {
      position: absolute;
      top: -10px;
      right: 15px;
    }
  }

  .image_container_horizontal {
    position: relative !important;

    .button-container {
      position: absolute;
      top: -10px;
      right: 15px;
    }
  }

  .vertical {
    height: 500px !important;
    max-width: 400px !important;
  }

  .horizontal {
    height: 250px !important;
    max-width: 400px !important;
  }
}

</style>
