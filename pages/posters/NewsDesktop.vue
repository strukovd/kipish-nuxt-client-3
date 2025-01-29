<template>
  <div class="news-desktop mid">
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/news', title: 'Новости'}]"/>
    <BaseTitle type="desktop" style="margin-bottom:.6em;"><h1>Новости</h1></BaseTitle>
    <BaseTitle type="desktop" style="margin-bottom:.6em;"><h2 style="font-size:32px;">Актуальные новости</h2></BaseTitle>

    <section class="news-section">
      <BaseNewsCard
        class="poster"
        :key="post.id"
        v-for="post of posts"
        :payload="post"
      />
      <BaseButton v-if="!pagesIsOver" type="small" @click="fetchPosts">Показать еще</BaseButton>
    </section>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import BaseBreadcrumbs from '@/components/common/BaseBreadcrumbs.vue';
import BaseNewsCard from '~/components/common/BaseNewsCard.vue';
import BaseTitle from '~/components/common/BaseTitle.vue';
import BaseButton from '~/components/common/BaseButton.vue';

export default {
  name: "NewsDesktop",
  components: { BaseBreadcrumbs, BaseNewsCard, BaseTitle, BaseButton, },
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
          href: 'https://kipish.kg/news/'
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
    pagesIsOver: false,
    totalFilesCounter: 0,

    loading: false,
    loadingContent: false,
    loadingMore: false,
  }),

  mounted() {
    // this.initOnScrollFetcher();
    this.fetchPosts();
  },

  methods: {
    // initOnScrollFetcher() {
      // window.onscroll = () => {
			// 	if (!this.pagesIsOver && !this.loadingContent && !this.loadingMore) {
			// 		let halfWindowHeight = window.innerHeight / 2;
			// 		let bottomOfWindow = document.documentElement.scrollTop + halfWindowHeight >= document.documentElement.offsetHeight - 5000;
			// 		if (bottomOfWindow) {
			// 			this.loadMore();
			// 		}
			// 	}
			// };
    // },

    async fetchPosts() {
			this.loadingMore = true;
			const params = {
				page: this.page,
				size: this.size,
        city: this.appStore.currentCity?.id ?? null,
				sort: 'pub_date,asc'
			};

			this.$http2.get(`/posts`, {params})
				.then(r => {
					if (r.data.totalPages - 1 === this.page) this.pagesIsOver = true;
					if (!r.data.content.length) return;
					this.page++;
					this.totalFilesCounter = r.data.totalElements;
					this.posts = this.posts.concat(r.data.content);
				})
				.finally(() => {
					this.loadingMore = false;
				});
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
  },
}
</script>


<style lang="scss">

.news-desktop {
  .news-section {
    display: flex;
    flex-direction: row;
    gap: 1.6em;
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
