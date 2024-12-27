<template>
  <div class="event-mobile mmid3">
    <!-- BREADCRUMBS -->
		<BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/event', title: 'Собития'}, {href: '', title: model?.name}]"/>
    <BaseTitle type="mobile" style="margin-bottom:.6em;">
      <h1>{{ pageTitle }}</h1>
    </BaseTitle>

    <!-- IMAGE -->
    <CardEventMobile :key="model?.id" :event="model"/>

    <!-- INFO -->
    <div class="tiles" style="display:flex; gap:1em; flex-wrap:wrap; justify-content:space-between; margin-top:2em;">
      <template v-for="tile of [
              {key: 'Дата проведения' , value: model.date, icon: 'calendar', hidden: model.options?.hideDate},
              {key: 'Место проведения', value: model.establishment?.name, icon: 'marker', hidden: model.options?.hideEstablishment},
              {key: 'Событие', value: model.title, icon: 'receipt', hidden: model.options?.hideTitle},
              {key: 'Контакты', value: model.contacts, icon: 'phone3', hidden: model.options?.hideContacts},
      ]">
        <div v-if="!tile.hidden" class="tile info-block d-flex align-center" :style="appStore.isDark ? 'background: #111111' : 'background: #FFFFFF'" style="flex:auto 1 0" :key="tile.key">
          <div :style="appStore.isDark ? 'background: #FFFFFF' : 'background: #111111'" style="border-radius:50%; min-width:52px; min-height:52px;" class="d-flex justify-center align-center mr-4">
            <heroicon :name="tile.icon" :stroke="appStore.isDark ? '#111111' : '#FFFFFF'" stroke-width="1" fill="none"/>
          </div>
          <div class="d-flex flex-column">
            <span class="black--text opacity-70 text-16 font-weight-300">{{ tile.key }}</span>
            <span class="black--text text-18">{{ tile.value }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- DESCRIPTION -->
    <v-card-text :style="appStore.isDark ? 'background: #111111' : 'background: #FFFFFF'" class="px-5 py-6 mt-10" style="border-radius: 24px">
      <div class="d-flex flex-column">
        <span :style="appStore.isDark ? 'color: #FFFFFF' : 'color: #111111'" class="text-28 font-title">Описание</span>
        <span v-html="model.description" :style="appStore.isDark ? 'color: #FFFFFF' : 'color: #111111'" class="mt-5 text-16 font-weight-300"></span>
      </div>
    </v-card-text>


  </div>
</template>

<script lang="ts">
import { mapStores } from "pinia";
import BaseBreadcrumbs from "~/components/common/BaseBreadcrumbs.vue";
import BaseTitle from "~/components/common/BaseTitle.vue";
import BaseButton from "~/components/common/BaseButton.vue";
import CardEventMobile from "~/components/common/CardEventMobile.vue";


export default defineComponent({
  name: "EventMobile",
  components: { BaseBreadcrumbs, BaseTitle, BaseButton, CardEventMobile },
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
  },

  methods: {
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

    getReport(id: string) {
      this.loading = true;
      const params = { id };
      this.$http2.get(`/posters`, { params })
        .then(r => {
          this.model = r.data.content[0];
          this.model.options = JSON.parse(this.model.options);
        })
        .finally(() => {
          this.loading = false;
        })
    }
  },

  created() {
    this.getReport(this.appStore.sourceId);
  }
});
</script>


<style lang="scss">
.event-mobile {
  .info-block {
    width: 100%;
    padding: 32px 32px 48px 32px;
    border-radius: 20px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

</style>
