<template>
  <!-- <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://kipish.kg/" },
        { "@type": "ListItem", "position": 2, "name": "События", "item": "https://kipish.kg/events" }
      ]
    }
    </script> -->
  <div class="events-mobile mmid3">
    <!-- BREADCRUMBS -->
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/events', title: 'События'}]"/>
    <h1 class="h1-font text-32 black--text font-title text-uppercase font-weight-300" style="margin-bottom:.6em;">Афиша мероприятий в Бишкеке</h1>

    <TimeRouletteNew :avgMonthWidth="1460" :dateMap="eventsDateMap" @setActualDay="selectDay" class="mb-6"/>

    <section v-if="showFilterOptions" data-aos="fade-down" data-aos-duration="300" class="reports-filter">
      <BaseTextBox v-model="filterOptions.name" placeholder="Название"/>
      <!-- <BaseTextBox v-model="filterOptions.establishmentName" placeholder="Заведение"/>
      <BaseTextBox @click="async ()=>{ const date = await $modal.show('', 'Calendar'); if(date) selectDay(date); }" v-model="selectedDay" placeholder="Выберите дату" disabled/> -->
    </section>

    <BaseButton @click="showFilterOptions = !showFilterOptions">
      <span>Фильтр</span>
      <heroicon name="filter" stroke="currentColor" fill="transparent"/>
    </BaseButton>

    <div class="d-flex align-end">
      <span class="mt-10 mb-6 text-20 font-weight-300 text-uppercase black--text font-title">
        {{ selectedDay ? formatDate(selectedDay) : 'АКТУАЛЬНЫЕ СОБЫТИЯ' }}
      </span>
    </div>

    <!-- КАРТОЧКИ -->
    <Loader v-if="!Array.isArray(filteredEventWithPanel)"/>
    <div v-else-if="filteredEventWithPanel.length === 0" class="text-32 black--text mt-6">Событий в этот день не найдено</div>
    <!-- Вставляем карточки рекламы среди карточек репортажей -->
    <section v-else class="event-cards">
      <CardEventMobile
        v-for="(event, index) of filteredEventWithPanel"
        :key="event.id"
        :event="event"
        data-aos="fade-up"
        data-aos-duration="1000"
      />
    </section>

  </div>
</template>

<script lang="ts">

import { mapStores } from "pinia";
import ADmob from "~/components/common/ad/ADmob.vue";
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";
import BaseButton from "~/components/common/BaseButton.vue";
import Loader from "~/components/common/Loader.vue";
import TimeRouletteNew from "~/components/common/TimeRouletteNew.vue";
import CardEventMobile from "~/components/common/CardEventMobile.vue";
import BaseTextBox from "~/components/common/BaseTextBox.vue";

export default defineComponent({
  name: "EventsMobile",
  components: { Loader, TimeRouletteNew, BaseBreadcrumbs, CardEventMobile, BaseButton, BaseTextBox },
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
  data: () => ({
    showFilterOptions: false,
    eventsDateMap: {} as any,
    selectedDay: null as any,
    visibleDays: [] as any[],
    page: 0,
    size: 15,

    closeOnClick: true,
    scrollPosition: 0,
    parallaxMultiplier: 0.5,
    albumsOnDay: {
      date: '',
      albums: []
    },
    categoriesPost: [] as any[],
    // filteredEvents: [],
    isMouseDown: false,
    startX: 0,
    scrollLeft: 0,
    events: [] as any[],
    filterOptions: {
      name: '',
      cata: null
    } as any,
    activeTab: 'ALL',
    loading: false
  }),

  created() {
    this.fetchEvents();
    this.getCategories();
    this.fetchDateMap();
  },

  methods: {
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
          })
    },

    getCategories() {
      this.$http.get('/dicts/categories', {params: {type: 'POSTER'}})
        .then(r => this.categoriesPost = r.data)
    },

    formatDate(dateString: string) {
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

    selectDay(date: string) {
      const formattedDate = this.convertDateToFetchFormat(date);
      this.selectedDay = formattedDate;
      this.visibleDays = [this.selectedDay];
      this.page = 0;

      this.fetchEvents(formattedDate);
    },

    convertDateToFetchFormat(date: string) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${day}-${month}-${year}`;
    },

    setActualDay(day: any) {
      this.albumsOnDay.albums = day.albums
      this.albumsOnDay.date = day.date
    },
  },
});
</script>


<style lang="scss">
.events-mobile {
  .reports-filter {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    margin:0 0 1em 0;

    >* {
      flex:auto 1 0;
    }
  }
}
</style>
