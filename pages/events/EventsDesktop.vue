<template>
  <div class="events-desktop mid">
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/establishments', title: 'Заведения'}]"/>
    <h1 style="margin-bottom:.6em;" class="h1-font text-68 black--text font-title text-uppercase font-weight-300">Лучшие заведения в Бишкеке</h1>

    <TimeRouletteNew :dateMap="eventsDateMap" @setActualDay="selectDay" class="mb-15"/>

    <section v-if="showFilterOptions" data-aos="fade-down" data-aos-duration="300" class="reports-filter">
      <BaseTextBox v-model="filterOptions.name" placeholder="Название"/>
      <!-- <BaseTextBox v-model="filterOptions.establishmentName" placeholder="Заведение"/>
      <BaseTextBox @click="async ()=>{ const date = await $modal.show('', 'Calendar'); if(date) selectDay(date); }" v-model="selectedDay" placeholder="Выберите дату" disabled/> -->
    </section>

    <div style="display: flex; justify-content: space-between; margin-bottom:1.6em;">
      <span class="pr-4 mr-4 text-32 font-weight-300 text-uppercase black--text font-title">Актуальные события</span>

      <!-- КНОПКА ФИЛЬТР, отображается только для первого дня -->
      <div>
        <button @click="toggleFilterPanel" class="button-v2" style="padding:.3em 1.6em;">
          <span>Фильтр</span>
          <heroicon name="filter" stroke="currentColor" fill="transparent"/>
        </button>
      </div>
    </div>


    <v-card-text v-if="!loading" class="pa-0 mt-10 d-flex flex-wrap events_block">
      <v-card-text class="pa-0 d-flex flex-wrap reports_block pb-8">
        <div v-if="filteredEventWithPanel.length === 0" style="flex:auto 1 0;">
          <h1 style="text-align:center; margin-top: 2em;" class="font-weight-300 text-uppercase black--text font-title">События в этот день не найдены</h1>
        </div>
        <BaseEventCard :event="event" v-for="(event, index) of filteredEventWithPanel" :key="event.id" width="416"/>
      </v-card-text>
    </v-card-text>
    <div v-else class="d-flex flex-wrap">
      <v-skeleton-loader class="skeleton_card" width="416" height="600" type="image" v-for="i in 3" :key="i"/>
    </div>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";
import TimeRouletteNew from "~/components/common/TimeRouletteNew.vue";
import BaseEventCard from "~/components/common/BaseEventCard.vue";
import BaseTextBox from "~/components/common/BaseTextBox.vue";

export default {
  name: "EventsDesktop",
  components: { TimeRouletteNew, BaseBreadcrumbs, BaseEventCard, BaseTextBox },

  data: () => ({
    eventsDateMap: {} as any,
    selectedDay: null as any,
    visibleDays: [] as any[],
    page: 0,
    size: 15,

    showFilterOptions: false,
    filterOptions: {
      name: '',
      cata: null
    } as any,

    closeOnClick: true,
    scrollPosition: 0,
    parallaxMultiplier: 0.5,
    categoriesPost: [] as any[],
    albumsOnDay: {
      date: '',
      albums: []
    } as any,
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,
    events: [] as any[],
    filteredEvents: [] as any[],
    filter: false,
    activeTab: 'ALL',
    eventTypes: ['ALL', 'CONCERT', 'EXHIBITION', 'PARTY', 'FESTIVAL', 'SHOW', 'PERFORMANCE'],
    loading: true,
  }),

  computed: {
    ...mapStores( useAppStore ),

    filteredEventWithPanel() {
      let filteredEvents = this.events;
      if (this.filterOptions.name) {
        filteredEvents = filteredEvents.filter((el: any) => el.title.toLowerCase().startsWith(this.filterOptions.name.toLowerCase()));
      }

      if (this.filterOptions.cata !== null) {
        filteredEvents = filteredEvents.filter((el: any) => el.eventType.nameRu === this.filterOptions.cata.nameRu);
      }

      return filteredEvents;
    }
  },

  watch: {
    activeTab(newTab) {
      this.filteredEvents = this.events
        .filter((event: any) => event.categories
          .some((category: any) => category.nameRu === this.activeTab)
        );
    }
  },

  created() {
    this.fetchEvents();
    this.getCategories();
    this.fetchDateMap();
  },

  methods: {
    toggleFilterPanel() {
      this.showFilterOptions = !this.showFilterOptions;
    },

    fetchDateMap() {
      const params = {
        city: this.appStore.currentCity?.id ?? null,
      };
      this.$http.get(`/posters/dateMap`, { params })
        .then(r => {
          this.eventsDateMap = r.data;
        })
        .catch((error) => {
          console.error(error);
          // this.selectDay( this.currentDay );
          // .. error
        })
    },

    fetchEvents(date?: any) {
      if(!this.appStore.currentCity) return;
      this.loading = true;
      const params = {
        cityId: this.appStore.currentCity.id,
        sort: 'date,asc',
      } as any;
      if(date) params.date = date;

      this.$http2.get('/posters', { params })
          .then(r => {
            this.events = r.data.content;
          })
          .finally(() => {
            this.loading = false
          });
    },

    selectDay(date: any) {
      const formattedDate = this.convertDateToFetchFormat(date);
      this.selectedDay = formattedDate;
      this.visibleDays = [this.selectedDay];
      this.page = 0;

      this.fetchEvents(formattedDate);
    },

    convertDateToFetchFormat(date: any) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${day}-${month}-${year}`;
    },

    getCategories() {
      this.$http.get('/dicts/categories', {params: {type: 'POSTER'}})
          .then(r => this.categoriesPost = r.data)
    },
    formatDate(dateString: any) {
      if(!dateString) return;

      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const dateParts = dateString.split('-');
      const formattedDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;

      const date = new Date(formattedDate);
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} / ${year}`;
    },
  },
}
</script>


<style lang="scss">
.events-desktop {
  .reports-filter {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    margin:0 0 2em 0;

    >* {
      flex:auto 1 0;
    }
  }
}
.reports_block {
  .img_item {
    .v-image__image {
      transition: transform 0.5s ease !important;
    }
  }

  .event-card:nth-child(3n-2) {
    /* к каждому первому (из 3) */
    margin:32px 32px 0 0;
  }

  .event-card:nth-child(3n-1) {
    /* к каждому второму (из 3) */
    margin:0 32px 0 0;
  }

  .event-card:nth-child(3n) {
    /* этот стиль применяется к каждому третьему элементу */
    margin-top:32px;
  }
}
.v-skeleton-loader__image {
  // width: 416px !important;
  // height: 516px !important;
  // border-radius: 16px !important;
}
.skeleton_card {
  width: 416px !important;
  height: 516px !important;
  border-radius: 16px !important;
  margin-right: 32px;
  margin-top: 32px;

  &:nth-child(3n) {
    margin-right: 0;
  }
}
.filter_panel {
  .v-icon {
    color: black !important;
  }
  .v-input input {
    color: black !important;
    &::placeholder {
      color: black !important;
    }
  }
}
.scroll-container {
  display: flex;
  cursor: pointer;
  user-select: none;
  overflow-x: hidden;
}

.day-events {
  /* Добавьте стили для событий дня здесь */
}

.event {
}

.events_block {
  .events_block__card {
    margin-right: 32px;
    margin-bottom: 32px;
  }

  .events_block__card:nth-child(2n) {
    margin-right: 0;
  }

  .events_block__card:nth-last-child(-n+2) {
    margin-bottom: 0;
  }
}

.animated-container {
  position: absolute;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s, transform 0.1s
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.events_block__card {
  transition: transform 0.3s ease;
  /* Добавьте плавность для эффекта */
}

.active-tab {
  margin-top: 20px;
  cursor: pointer;
  height: 40px;
  padding: 10px 24px;
  background: #FE252E;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
}

.tab {
  margin-top: 20px;
  cursor: pointer;
  height: 40px;
  padding: 10px 24px;
  border-radius: 60px;
  background: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #111111;
}
</style>
