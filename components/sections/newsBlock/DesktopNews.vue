<template>
    <div class="desktop-reports mid">
    <h1 v-html="$t('main.news-title')" class="h1-font text-82 font-weight-300 font-title black--text text-uppercase"></h1>


    <section style="display:flex; flex-direction:row; gap:1em;">
      <section style="flex:30% 0 0;">
        <div style="margin-top:8em;">
          <img src="/images/news-subscribe.png" alt="subscribe" width="100%">
        </div>
        <!-- <div>
          <h2>Будь в курсе новостей</h2>
          <div>Подпишителсь на наши соц. сети</div>
          <BaseButton>Подписаться</BaseButton>
        </div> -->
      </section>
      <section style="flex:70% 0 0;">
        <div style="position: relative;border-radius: 20px 0 0 20px; gap:2em;" class="d-flex flex-wrap mt-15">
          <template v-if="!loading">
            <BaseNewsCard v-for="post of posts" :key="post.id" :payload="post" width="100%"/>
            <!-- <BaseEstabCard v-for="estab of estabs" :key="estab.id" :item="estab"></BaseEstabCard> -->
          </template>
          <template v-else>
            <div v-for="i of 4" :key="i" style="display:flex;flex-direction:column;overflow:hidden;border-radius:20px;position:relative;">
              <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
            </div>
          </template>
        </div>
      </section>
    </section>

    <div style="display:flex; justify-content:center; margin-top:110px; padding:0;">
      <button class="button-v1" @click="$router.push('/posts')">{{ $t('main.news-show-more') }}</button>
    </div>
  </div>
</template>

<script>
import BaseEstabCard from "@/components/common/BaseEstabCard.vue";
import { mapStores } from "pinia";
import BaseButton from "~/components/common/BaseButton.vue";
import BaseNewsCard from "~/components/common/BaseNewsCard.vue";

export default {
  name: "DesktopEstabs",
  components: { BaseEstabCard, BaseNewsCard, BaseButton },
  computed: {
    ...mapStores(useAppStore, ['currentCity']),
  },
  data: () => ({
    loading: false,
    currentSlideEstab: [],
    posts: [],
  }),
  created() {
    if (this.appStore.currentCity) {
      this.fetchNews()
    }
  },
  methods: {
    async fetchNews() {
      if(!this.appStore.currentCity) {
        return;
      }
      this.loading = true;
      this.currentSlideEstab = [];
      const params = {cityId: this.appStore.currentCity.id}
      try {
        const { data: { content } } = await this.$http2.get('/posts?size=2');
        this.posts = content;
        this.currentSlideEstab = Array(this.posts.length).fill(1);
        this.loading = false;
      } catch (e) {
        this.posts = [];
        this.loading = false
      }
    },

    customPrevEstab(estabIndex) {
      if (this.currentSlideEstab[estabIndex] > 1) {
        this.currentSlideEstab = [...this.currentSlideEstab];
        this.currentSlideEstab[estabIndex]--;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].prev();
        });
      }
    },
    customNextEstab(estabIndex) {
      if (this.currentSlideEstab[estabIndex] < this.posts[estabIndex].images.filter(el => el.source === 'ESTABLISHMENT').length) {
        this.currentSlideEstab = [...this.currentSlideEstab];
        this.currentSlideEstab[estabIndex]++;
        this.$nextTick(() => {
          this.$refs.estab[estabIndex].next();
        });
      }
    },
  }
}
</script>

<style lang="scss">
// .desktop_estabs {
//   .button_link {
//     &:hover {
//       background: #373737 !important;
//     }
//   }

//   .v-skeleton-loader__image {
//     width: 416px !important;
//     height: 600px !important;
//     border-radius: 16px !important;
//   }

//   .estabs_card {
//     width: 416px;
//     height: 600px;
//     margin-right: 32px !important;
//     margin-bottom: 32px !important;
//   }

//   //.estabs_card:nth-child(3n+1),
//   //.estabs_card:nth-child(3n+3) {
//   //  .estabs_card__content {
//   //    height: 340px !important;
//   //  }
//   //  height: 440px !important;
//   //  .v-image {
//   //    height: 340px !important;
//   //  }
//   //  .v-image__image {
//   //    height: 340px !important;
//   //  }
//   //}

//   //.estabs_card:nth-child(3n+2) {
//   //  height: 420px !important;
//   //  .estabs_card__content {
//   //    height: 320px !important;
//   //  }
//   //  .v-image {
//   //    height: 320px !important;
//   //  }
//   //  .v-image__image {
//   //    height: 320px !important;
//   //  }
//   //}

//   .estabs_card:nth-child(3n) {
//     margin-right: 0 !important;
//   }

//   .estabs_card:nth-last-child(-n+3) {
//     margin-bottom: 0 !important;
//   }
// }

</style>
