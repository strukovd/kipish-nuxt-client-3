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
    <div class="d-flex align-end">
      <span class="mt-10 mb-6 text-20 font-weight-300 text-uppercase black--text font-title">
        {{ selectedDay ? formatDate(selectedDay) : 'АКТУАЛЬНЫЕ СОБЫТИЯ' }}
      </span>
    </div>
    <BaseButton @click="showFilterOptions = !showFilterOptions">
      <span>Фильтр</span>
      <heroicon name="filter" stroke="currentColor" fill="transparent"/>
    </BaseButton>
    <!-- <div class="filter">
      <transition name="fade">
        <div v-if="showFilterOptions" class="d-flex flex-column mt-4 filter-panel">
          <v-text-field v-model="filterOptions.name" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details placeholder="Название"/>
          <v-text-field v-model="filterOptions.establishmentName" style="border-radius: 12px;background: #FFFFFF;width: 100%" outlined hide-details class="mt-4" placeholder="Заведение"/>
          <v-btn style="border: none; margin: 0; background: #ffffff; border-radius: 12px !important; border: 1px solid rgba(0, 0, 0, 0.10)" outlined color="white" class="d-flex justify-start text-none py-7 px-3 mt-4" @click="openDatePicker = true">
            <span style="color: #000000" class="text-16 mr-3 font-weight-375">{{ selectedDay ? selectedDay : 'Выберите дату'}}</span>
          </v-btn>
        </div>
      </transition>
    </div> -->

    <!-- КАРТОЧКИ -->
    <Loader v-if="!Array.isArray(filteredEvents)"/>
    <div v-else-if="filteredEvents.length === 0" class="text-32 black--text mt-6">Событий в этот день не найдено</div>
    <!-- Вставляем карточки рекламы среди карточек репортажей -->
    <section v-else class="event-cards">
      <CardEventMobile
        v-for="(event, index) of filteredEvents"
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

export default defineComponent({
  name: "EventsMobile",
  components: { Loader, TimeRouletteNew, BaseBreadcrumbs, CardEventMobile, BaseButton },
  computed: {
    ...mapStores( useAppStore ),

    filteredEvents() {
      if (this.activeTab === 'ALL') {
        return this.events;
      }

      return this.events
        .filter((event: any) => event.categories
          .some((category: any) => category.nameRu === this.activeTab)
        );
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
    filter: false,
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

    filterPanel() {
      this.filter = !this.filter
    },
  },
});
</script>


<style lang="scss">
.events_block {
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

  .months_block {
    .v-input__slot {
      i {
        margin-top: 10px !important;
      }

      font-family: "ALS Hauss VF",
      sans-serif;

      &::before {
        border: none !important;
      }

      &::after {
        border: none !important;
      }

      cursor: pointer !important;
    }

    .v-select__selections {
      input {
        opacity: 0;
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

  .reports_block {
    .card_item {
      margin-bottom: 32px;

      &:last-child {
        margin-bottom: 0;
      }
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

  .reports_block__card {
    transition: transform 0.3s ease;
    /* Добавьте плавность для эффекта */
  }

  .active-tab {
    cursor: pointer;
    padding: 10px 24px;
    background: #FE252E;
    border-radius: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFFFF;
    margin-top: 16px;
  }

  .tab {
    cursor: pointer;
    padding: 10px 24px;
    border-radius: 60px;
    background: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #111111;
    margin-top: 16px;
  }

  .wrapper {
    width: 1440px !important;
    margin: 0 auto;
  }

  @media screen and (max-width: 1400px) {
    .wrapper {
      width: 1000px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 1024px) {
    .wrapper {
      width: 800px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 800px) {
    .wrapper {
      width: 600px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 600px) {
    .wrapper {
      width: 500px !important;
      margin: 0 auto;
    }
  }


  @media screen and (max-width: 500px) {
    .wrapper {
      width: 430px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 430px) {
    .wrapper {
      width: 420px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 400px) {
    .wrapper {
      width: 390px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 375px) {
    .wrapper {
      width: 370px !important;
      margin: 0 auto;
    }
  }

  @media screen and (max-width: 345px) {
    .wrapper {
      width: 345px !important;
      margin: 0 auto;
    }
  }
}
</style>
