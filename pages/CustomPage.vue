<template>
  <div class="page-desktop mid">
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '', title: title}]"/>
    <h1 class="h1-font text-68 black--text font-title text-uppercase font-weight-300">{{ title }}</h1>
    <article v-html="text"></article>
  </div>
</template>

<script lang="ts">
import {Quill, VueEditor} from 'vue2-editor';
import { mapStores } from "pinia";
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";


function getFontName(font: string) {
  return font.toLowerCase().replace(/\s/g, '-')
}

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
            const { key, title, text } = r.data?.content[0] || [];
            this.title = title;
            this.text = text;
          });
    },

    init() {
      if( !import.meta.browser) return;

      const fontList = ['Qanelas'];
      const fontNames = fontList.map(font => getFontName(font));
      const fonts = Quill.import('formats/font');
      fonts.whitelist = fontNames;
      Quill.register(fonts, true);

      let fontStyles = '';
      fontList.forEach(function (font) {
        let fontName = getFontName(font)
        fontStyles +=
          '.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=' +
          fontName +
          ']::before, .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=' +
          fontName +
          ']::before {' +
          "content: '" +
          font +
          "';" +
          "font-family: '" +
          font +
          "', sans-serif;" +
          '}' +
          '.ql-font-' +
          fontName +
          '{' +
          " font-family: '" +
          font +
          "', sans-serif;" +
          '}'
      });

      const node = document.createElement('style')
      node.innerHTML = fontStyles
      document.body.appendChild(node);
    }
  },

  created() {
    this.fetch();
    this.init();
  }
}
</script>

<style lang="scss" scoped>

</style>
