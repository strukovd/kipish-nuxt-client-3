<template>
  <div class="news-desktop mid">
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/news', title: 'Новости'}]"/>
    <h1 class="h1-font text-68 black--text font-title text-uppercase font-weight-300">Новости</h1>

    <div class="d-flex flex-column">
      <span class="text-32 black--text text-uppercase font-title" style="font-weight:300;">Актуальные новости</span>
    </div>

    <section class="news-section">
      <BaseNewsCard
        class="poster"
        :key="post.id"
        v-for="post of posts"
        width="50%"
        :payload="post"
      />
    </section>

  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import TimeRouletteNew from "@/components/common/TimeRouletteNew.vue";
import VPlayer from "@/components/common/VPlayer/VPlayer.vue";
import ADpc from "@/components/common/ad/ADpc.vue";
import BaseBreadcrumbs from '@/components/common/BaseBreadcrumbs.vue';
import BaseTextBox from '~/components/common/BaseTextBox.vue';
import BaseNewsCard from '~/components/common/BaseNewsCard.vue';

export default {
  name: "VideosDesktop",
  components: { ADpc, VPlayer, TimeRouletteNew, BaseBreadcrumbs, BaseNewsCard, BaseTextBox },
  computed: {
    ...mapStores( useAppStore ),

    filteredPosts() {
      if (this.filterOptions?.name || this.filterOptions.date) {
        return this.posts;
      } else {
        return this.posts;
      }
    }
  },

  head() {
    return {
      link: [
        {rel: 'icon', type: 'image/x-icon', href: '/favicon.svg'},
        {
          rel: 'canonical',
          href: 'https://kipish.kg/videos/'
        }
      ],
    }
  },

  data: () => ({
    filterOptions: {
      name: '',
    } as any,

    posts: [] as any[],

    showFilterOptions: false,
    page: 0,
    size: 15,
    loading: false,
    loadingContent: false,
    loadingMore: false,
  }),

  mounted() {
    this.initOnScrollFetcher();
    this.fetchNews();
  },

  methods: {
    shouldShowDesktopEvents(dayIndex: any) {
      return dayIndex >= 2 && (dayIndex - 2) % 3 === 0;
    },

    initOnScrollFetcher() {
      // this.loadingMore = false;

      // window.onscroll = () => {
      //   if (this.selectedDay) {
      //     return;
      //   }

      //   if (!this.loadingMore
      //     && !this.loading
      //     && !this.loadingContent
      //     && this.potentialDays?.length > 0) {
      //     let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 300;
      //     if (bottomOfWindow) {
      //       const nextActualDateRaw = this.potentialDays.shift();
      //       if(nextActualDateRaw) {
      //         const nextActualDate = this.convertDateToFetchFormat(nextActualDateRaw);
      //         this.visibleDays.push(nextActualDate);
      //         this.fetchNews(nextActualDate);
      //       }
      //     }
      //   }
      // };
    },

    convertDateToFetchFormat(date: string) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${day}-${month}-${year}`;
    },

    formatDate(dateString: any) {
      if (!dateString) {
        return 'Invalid date';
      }

      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ];

      const parts = dateString.split('-');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);

      const date = new Date(year, month, day);

      if (isNaN(date.getTime())) {
        console.error('Invalid date format:', dateString);
        return 'Invalid date';
      }

      const formattedDate = `${day} ${months[month]} / ${year}`;
      return formattedDate;
    },

    getDayOfWeekFormatted(date: any) {
      const [day, month, year] = date.split('-').map(Number);
      const formattedDate = new Date(year, month - 1, day); // Месяцы в JavaScript начинаются с 0
      const options = {weekday: 'long'} as any;
      return new Intl.DateTimeFormat('ru-RU', options).format(formattedDate);
    },

    formatDateFormatted(date: any) {
      const [day, month, year] = date.split('-').map(Number);
      const formattedDate = new Date(year, month - 1, day); // Месяцы в JavaScript начинаются с 0
      const options = {day: 'numeric', month: 'long'} as any;
      return new Intl.DateTimeFormat('ru-RU', options).format(formattedDate);
    },

    toggleFilterPanel() {
      this.showFilterOptions = !this.showFilterOptions;
    },

    init() {
      this.loading = true;
      this.fetchNews();
    },

    async fetchNews() {
      try {
        this.loadingContent = true;
        const params = {
          city: this.appStore.currentCity?.id ?? null,
          sort: 'pub_date,desc',
        };
        const response = await this.$http2.get(`/posts`, { params });
        console.log(response.data)
        const reportList = response.data?.content || [];
        this.posts = reportList;
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        this.loadingContent = false;
      }
    },
  },
}
</script>


<style lang="scss">

.news-desktop {
  .news-section {
    display: flex;
    flex-direction: row;
    gap: 1em;
    justify-content: center;
    flex-wrap: wrap;

    .poster {
      flex:45% 1 0;
    }
  }
  .news-filter {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1em;
    margin:.6em 0;

    >* {
      flex:auto 1 0;
    }
  }

}


</style>
