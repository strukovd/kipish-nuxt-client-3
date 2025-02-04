<template>
  <div class="post-mobile mmid3">
    <!-- BREADCRUMBS -->
		<BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/posts', title: 'Новости'}, {href: '', title: model.title}]"/>
    <BaseTitle type="mobile" style="margin-bottom:.6em;">
      <h1>{{ pageTitle }}</h1>
    </BaseTitle>

    <div style="display: flex; flex-direction: row-reverse;">
      <template v-if="model.pubDate">
        <span class="report-date">{{ formatDate(model.pubDate) }}</span>
        <span class="report-year">{{ formatDateForYear(model.pubDate) }}</span>
      </template>
    </div>

    <section class="picture" style="margin:2em 0; overflow:hidden;">
      <img style="width:100%; object-fit:cover; border-radius:24px;" v-if="model.coverPath" :src="`https://files.kipish.kg/${model.coverPath}`">
    </section>

    <section class="description">
      {{ model.description }}
    </section>


    <section class="text">
      <p v-html="model.text"></p>
    </section>
  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";
import BaseTitle from "~/components/common/BaseTitle.vue";
import BaseButton from "~/components/common/BaseButton.vue";


export default defineComponent({
  name: "PostMobile",
  components: { BaseBreadcrumbs, BaseTitle, BaseButton },

  data: () => ({
    loading: true,
    model: {} as any
  }),

  computed: {
    ...mapStores( useAppStore ),
    pageTitle() {
      let title = ``;
      if (this.model?.eventType?.nameRu) {
        title += `${this.model.eventType.nameRu} `;
      }
      title += `${this.model.title}`;

      return title;
    },

    schemaEvent() {
      const model = this.model || {};
      const establishment = model.establishment || {};
      const files = model.files || [];

      return {
        "@context": "http://schema.org",
        "@type": "Event",
        name: model.title || '',
        description: model.description || '',
        image: files.length ? `https://files.kipish.kg/${files[0].minioBucket}/${files[0].minioPath}` : '',
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        startDate: model.date || '',
        location: {
          "@type": "Place",
          name: establishment.name || '',
          address: {
            addressRegion: "Chuy",
            postalCode: "724314",
            addressCountry: "Kyrgyzstan"
          }
        },
        organizer: {
          "@type": "Organization",
          name: "Kipish",
          url: "https://kipish.kg/"
        }
      };
    }
  },

  methods: {
    setHead() {
      useHead({
        script: [
          { type: 'application/ld+json', children: JSON.stringify(this.schemaEvent) }
        ],
        title: this.model.title ? `${this.model.title} | Кипиш` : 'Кипиш',
        meta: [
          {
            name: 'description',
            content:
              (this.model?.date ? this.model.date : '') +
              (this.model?.establishment?.name ? ` в ${this.model.establishment.name} ` : '') +
              (this.model?.eventType?.nameRu ? `состоится ${this.model.eventType.nameRu} — ` : '') +
              (this.model?.title ? `${this.model.title}. ` : '') +
              `Смотрите фото и видео отчет и подробности мероприятия на Кипише.`
          },
          { name: 'keywords', content: 'бар, Бишкек, отдых, напитки, развлечения' },
          { property: 'og:title', content: this.model.title ? `${this.model.title} | Кипиш` : 'Кипиш' },
          {
            property: 'og:description',
            content:
              (this.model?.date ? this.model.date : '') +
              (this.model?.establishment?.name ? ` в ${this.model.establishment.name} ` : '') +
              (this.model?.eventType?.nameRu ? `состоится ${this.model.eventType.nameRu} — ` : '') +
              (this.model?.title ? `${this.model.title}. ` : '') +
              `Смотрите фото и видео отчет и подробности мероприятия на Кипише.`
          },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: 'https://www.kipish.kg/' },
          { property: 'og:image', content: 'https://files.kipish.kg/static/images/logo-white.png' },
          { property: 'og:image:width', content: '53' },
          { property: 'og:image:height', content: '54' },
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
          { rel: 'canonical', href: 'https://kipish.kg/event/' }
        ]
      });
    },

    formatDateForYear(dateString: string) {
      if(dateString) {
        const [day, month, year] = dateString.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        const date = new Date(formattedDate);

        if (isNaN(date.getTime())) {
          return 'Неверная дата';
        }

        return date.getFullYear().toString();
      }
    },
    formatDate(dateString: string) {
      console.log(dateString);
      if( !dateString ) {
        return 'Неверная дата';
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

    fetchReport(id: string) {
      this.loading = true;
      const params = { id: id };
      this.$http2.get(`/posts`, { params })
          .then(r => {
            this.model = r.data.content[0];
            this.model.options = JSON.parse(this.model.options);
          })
          .finally(() => {
            this.loading = false;
          })
    }
  },

  mounted() {
    this.setHead();
  },

  created() {
    this.fetchReport(this.appStore.sourceId);
  }
});
</script>


<style lang="scss">
.post-mobile {
  .report-date {
    font-size: 28px;
    text-transform: uppercase;
    padding-right: 20px;
    border-right: 1px solid color-mix(in srgb, currentColor 20%, transparent);
  }
  .report-year {
    opacity: 0.7;
    font-size: 20px;
    margin-left: 20px;
  }
}

</style>
