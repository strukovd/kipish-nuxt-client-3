<template>
  <div class="page-desktop mid">
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/reports', title: 'Репортажи'}]"/>
    <h1 class="h1-font text-68 black--text font-title text-uppercase font-weight-300">{{ title }}</h1>
    <article v-html="text"></article>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";


export default {
  name: "CustomPage",
  components: { BaseBreadcrumbs },
  computed: {
    ...mapStores( useAppStore ),
  },

  data: () => ({
    title: '',
    text: '',
  }),

  methods: {
    async fetch() {
      const params = {
        key: String(this.$route.path).replace('/', ''),
      };

      this.$http.get(`/pages`, { params })
          .then(async r => {
            const { title, text } = r.data?.content[0] || [];
            this.title = title;
            this.text = text;
          });
    },
  },

  created() {
    this.fetch();
  }
}
</script>

<style lang="scss" scoped>

</style>
