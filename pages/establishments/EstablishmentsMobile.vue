<template>
  <div class="establishments-mobile mmid3">
    <!-- BREADCRUMBS -->
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/establishments', title: 'Заведения'}]"/>
    <h1 class="h1-font text-32 black--text font-title text-uppercase font-weight-300" style="margin-bottom:.6em;">Лучшие заведения в Бишкеке</h1>
    <!-- TODO: TAGS -->
    <!-- TODO: FILTER -->

    <div class="d-flex align-end">
      <span class="mt-10 mb-6 text-20 font-weight-300 text-uppercase black--text font-title">
        Топ заведений
      </span>
    </div>

    <!-- Карточки заведений -->
    <div class="cards-container d-flex flex-column flex-nowrap mt-10" style="gap:1em;">
      <template v-if="!loading">
        <MCardEstab v-for="estab of visibleItems" :key="estab.id" :item="estab"/>
      </template>
      <template v-else>
        <div v-for="i of 3" :key="i" style="display:flex;flex-direction:column;overflow:hidden;border-radius:20px;position:relative;">
          <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";
import MCardEstab from "~/components/common/MCardEstab.vue";

export default {
  name: "EstablishmentsMobile",
  components: { MCardEstab, BaseBreadcrumbs },
  data: () => ({
    visibleItems: [],
    filterModel: {
      city: null,
      name: null,
      activeTab: 'ALL',
      avrCheck: null,
      categories: null,
    },

    dict: {
      categories: [
        "Бар",
        "Караоке-бар",
        "Лаундж-бар",
        "Суши-бар",
        "Чайхана",
        "Шашлычная"
      ],
      ticksLabels: [
        'Все',
        '500',
        '1000',
        '1500',
        '2000',
        '2500+',
      ],
      establishments: [],
      allCategories: [],
    },




    categories: [],
    currentSlide: [],
    scrollPosition: 0,
    filteredEstabs: [],
    estabsWithAds: [],
    estabs: [],
    filter: false,
    activeTab: 'ALL',
    city: null,
    page: 0,
    size: 3,
    loading: false,
    loadingContent: false,
    filterPanel: {
      name: null,
      cata: null,
      price: 0
    },
    loadingMore: false,
    hasMoreData: false,
    searchResult: null
  }),
  watch: {
    'filterModel.city': () => { this.fetchItems(); },
    'filterModel.name': () => { this.fetchItems(); },
    'filterModel.avrCheck': () => { this.fetchItems(); },
    'filterModel.categories': () => { this.fetchItems(); },

    activeTab(newTab) {
      this.filteredEstabs = this.estabs.filter(estab => estab.categories.some(category => category.nameRu === this.activeTab));
    },
  },
  computed: {
    displayedEstabs() {
      return this.estabsWithAds;
    }
  },
  mounted() {
    this.fetchItems();
    this.fetchCategories();
    this.fetchEstablishmentNames();
  },
  methods: {
    fetchItems() {
      this.loading = true;
      // const sortState = `${this.sortBy},${this.sortDesc ? 'desc' : 'asc'}`;
      const params = {
        city: this.city?.id ?? 1,
        // pattern: this.search ? this.search : null,
        top: true,
        // status: this.activeFilterTab === 'ARCHIVE' ? 'ARCHIVED' : null,
        // avrCheck: this.filterPanel.price ? this.filterPanel.price : null,
        // categories: this.filterPanel.cata ? this.filterPanel.cata : null,

        page: 0,
        size: 3,
        // sort: sortState
      };
      this.$http2.get(`/establishments`, {params})
        .then(r => {
          const payload = r.data.content;
          if(payload?.paysways) payload.paysways = JSON.parse(payload.paysways); else payload.paysways = {};
          if(payload?.socials) payload.socials = JSON.parse(payload.socials); else payload.socials = {};

          this.visibleItems = payload;
          this.fetchEstabsImages(this.visibleItems);
          // this.totalPages = r.data.totalPages;
          // this.totalItems = r.data.totalElements;
          // this.fetchReportImages();
        })
        .finally(() => {
          this.loading = false;
        });
    },

    async filterEstabWithPanel() {
      let filteredEstabs = [];

      // Получаем заведения, подходящие по среднему чеку
      const params = {
        avrCheck: this.filterPanel.price ? this.filterPanel.price : null
      }

      try {
        const response = await this.$http2.get('/establishments', { params });
        const priceFilteredEstabs = response.data.content.filter(estab => estab.id === 37 || estab.id === 30 || estab.id === 41);
        // Если есть результат поиска, используем его
        if (this.searchResult) {
          // Фильтруем результат поиска в соответствии с активным табом и среднему чеку
          filteredEstabs = this.searchResult.filter(el => {
            return priceFilteredEstabs.some(estab => estab.id === el.id) &&
              (this.activeTab === 'ALL' || el.categories.some(category => category.nameRu === this.activeTab) || this.activeTab === null);
          });
        } else {
          // Если активный таб 'ALL', показываем все заведения, подходящие по среднему чеку
          if (this.activeTab === 'ALL') {
            filteredEstabs = priceFilteredEstabs;
          } else {
            // Фильтруем estabs в соответствии с активным табом, категориями и среднему чеку
            filteredEstabs = this.estabs.filter(el => {
              return priceFilteredEstabs.some(estab => estab.id === el.id) &&
                (this.activeTab === 'ALL' || el.categories.some(category => category.nameRu === this.activeTab) || this.activeTab === null) &&
                (this.activeTab === null || el.categories.some(category => category.nameRu === this.activeTab));
            });
          }
        }

        // Добавляем объявления
        const estabsWithAds = [...filteredEstabs];
        let adCounter = Math.floor(estabsWithAds.length / 6);
        for (let i = 1; i <= adCounter; i++) {
          estabsWithAds.splice(i * 6 + (i - 1), 0, { advert: true });
        }

        this.filteredEstabs = filteredEstabs;
        this.estabsWithAds = estabsWithAds;
      } catch (error) {
        console.error('Error fetching establishments:', error);
      }
    },

    async fetchEstablishmentNames() {
      const params = {
        page: 0,
        size: 1000
      }
      this.$http2.get('/establishments/simple', {params})
        .then((response) => {
          this.dict.establishments = response.data.content;
        });
    },

    setActiveTab(cata) {
      this.activeTab = cata
    },

    zoomToTop() {
      this.$scrollTo('#top', 500, {easing: 'ease-in-out'});
    },

    getMoreEstabs() {
      this.loadingMore = false;
      this.hasMoreData = true;

      window.onscroll = () => {
        if (!this.loadingMore && this.hasMoreData) {
          let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 300;
          if (bottomOfWindow) {
            this.loadingMore = true;
            this.loadMore();
          }
        }
      };
    },

    truncateText(text, maxLength) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      } else {
        return text;
      }
    },

    openEstab(id) {
      this.$router.push('/establishment/' + id)
    },

    formatDate(dateString) {
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const date = new Date(dateString);
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} / ${year}`;
    },
    getDayOfWeekFormatted(date) {
      const options = {weekday: 'long'};
      return new Intl.DateTimeFormat('ru-RU', options).format(date);
    },
    formatDateFormatted(date) {
      const options = {day: 'numeric', month: 'long'};
      return new Intl.DateTimeFormat('ru-RU', options).format(date);
    },
    setActualDay(day) {
      this.albumsOnDay.albums = day.albums
      this.albumsOnDay.date = day.date
    },
    getCoverFile(files) {
      const coverFile = files.find(el => el.isCover === true);
      return coverFile ? 'data:image/png;base64,' + coverFile.file : null;
    },
    setSelectedCity(city) {
      this.city = city
      this.getEstabs(this.city)
    },
    handleScroll() {
      this.scrollPosition = this.$refs.reportsBlock.scrollTop;
    },
    handleFilter() {
      this.filter = !this.filter
    },
    getCategories() {
      this.$http.get('/dicts/categories', {params: {type: 'ESTABLISHMENT'}})
        .then(r => this.categories = r.data)
    },
    getEstabs(city) {
      this.estabs = [];
      this.page = 0;
      this.loadMore(city);
      this.loading = true
    },
    loadMore() {
      if (!this.hasMoreData) return;

      this.loadingContent = true
      this.$http2.get(`/establishments?city=${this.city.id}&page=${this.page}&size=${this.size}`)
        .then(r => {
          const payload = r.data.content;
          if (payload.length === 0) {
            if(payload?.paysways) payload.paysways = JSON.parse(payload.paysways); else payload.paysways = {};
            if(payload?.socials) payload.socials = JSON.parse(payload.socials); else payload.socials = {};

            console.log("Содержимое пустое. Больше нет данных для загрузки.");
            this.loadingMore = false;
            this.hasMoreData = false;
            return;
          }
          this.page++
          const filteredEstabs = r.data.content.filter(estab => estab.id === 37 || estab.id === 30 || estab.id === 41)
          this.estabs = this.estabs.concat(r.data.content);
          this.fetchEstabsImages(this.estabs)
          this.loadingContent = false
          this.loadingMore = false;
        })
        .catch(error => {
          console.error('Ошибка при загрузке данных:', error);
          this.loadingContent = false
        });
    },

    async fetchEstabsImages(estabs) {
      if (!estabs) estabs = this.estabs;
      for (const estab of estabs) {
        if (estab.coverImageId) {
          this.fetchImage(estab.coverImageId)
            .then(image => {
              Vue.set(estab, 'coverImage', image);
            });
        }
      }
    },

    fetchImage(imageId) {
      return this.$http.get(`/files/${imageId}`)
        .then(r => {
          const imageMap = r.data;
          return imageMap[imageId];
        });
    },

    handleScroll() {
      this.scrollPosition = this.$refs.reportsBlock.scrollTop;
    },
    handleFilter() {
      this.filter = !this.filter
    },
    fetchCategories() {
      this.$http.get('/dicts/categories', {params: {type: 'ESTABLISHMENT'}})
        .then(r => this.dict.allCategories = r.data)
    },
    getEstabs(city) {
      this.estabs = [];
      this.page = 0;
      this.loadMore(city);
    },
    customPrevEstab(estabIndex) {
      if (this.currentSlide[estabIndex] > 1) {
        this.currentSlide = [...this.currentSlide];
        this.currentSlide[estabIndex]--;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].prev();
        });
      }
    },
    customNextEstab(estabIndex) {
      if (this.currentSlide[estabIndex] < this.estabs[estabIndex].images.filter(el => el.source === 'ESTABLISHMENT').length) {
        this.currentSlide = [...this.currentSlide];
        this.currentSlide[estabIndex]++;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].next();
        });
      }
    },
  },
}
</script>

<style lang="scss">
.establishments-mobile {

}
</style>
