<template>
	<div class="event-desktop mid">

    <!-- BREADCRUMBS -->
    <BaseBreadcrumbs :breadcrumbs="[{href: '/', title: 'Главная'}, {href: '/events', title: 'События'}, {href: '', title: model.title}]"/>
    <section>
      <BaseTitle>
        <h1>{{ pageTitle }}</h1>
      </BaseTitle>
    </section>
    <main style="display:flex; gap:2em; margin:2em 0;">
      <div class="coverImage" style="flex:auto 1 0; width:450px; overflow:hidden; filter:brightness(0.8);">
        <img style="width:100%; object-fit:cover; border-radius:24px;" v-if="Array.isArray(model.files)" :src="`https://files.kipish.kg/${model.files[0].minioBucket}/${model.files[0].minioPath}`">
      </div>
      <div class="content">
        <div class="date">
          <span style="border-right: 1px solid #111111" class="text-28 font-weight-300 font-title black--text text-uppercase pr-4">{{ formatDate(model.date) }}</span>
          <span class="black--text opacity-70 text-20 ml-4">{{ formatDateForYear(model.date) }}</span>
        </div>
        <div class="description">
          <span v-html="model.description" class="text-20 dark--text opacity-70 ml-4"></span>
        </div>
      </div>
    </main>

    <div class="tiles" style="display:flex; gap:2em; flex-wrap:wrap; justify-content:space-between; margin-top:2em;">
      <template
        v-for="tile of [
          {key: 'Дата проведения' , value: model.date, icon: 'calendar', hidden: model.options?.hideDate},
          {key: 'Место проведения', value: model.establishment?.name, icon: 'marker', hidden: model.options?.hideEstablishment},
          {key: 'Событие', value: model.title, icon: 'receipt', hidden: model.options?.hideTitle},
          {key: 'Контакты', value: model.contacts, icon: 'smartphone', hidden: model.options?.hideContacts},
        ]"
      >
        <div v-if="!tile.hidden" :key="tile.key" class="tile info-block d-flex align-center" :style="appStore.isDark ? 'background: #111111' : 'background: #FFFFFF'"
          style="flex:auto 1 0">
          <div :style="appStore.isDark ? 'background: #FFFFFF' : 'background: #111111'" style="border-radius:50%; min-width:52px; min-height:52px;" class="d-flex justify-center align-center mr-4">
            <heroicon :name="tile.icon" :stroke="appStore.isDark ? '#111111' : '#FFFFFF'" stroke-width="1" fill="none"/>
          </div>
          <div class="d-flex flex-column">
            <span class="black--text opacity-70 text-16 font-weight-300">{{ tile.key }}</span>
            <span class="black--text text-20">{{ tile.value }}</span>
          </div>
        </div>
      </template>
    </div>

  </div>
</template>

<script lang="ts">
import BaseBreadcrumbs from '~/components/common/BaseBreadcrumbs.vue';
import { mapStores } from 'pinia';
import BaseTitle from '~/components/common/BaseTitle.vue';


export default defineComponent({
	name: "EventDesktop",
	components: { BaseBreadcrumbs, BaseTitle },

	data() {
		return {
      loading: true,
      model: {} as any
		}
	},

	computed: {
		...mapStores( useAppStore ),
    pageTitle() {
      let title = ``;
      if (this.model?.eventType?.nameRu) {
        title += `${this.model.eventType.nameRu} `;
      }
      title += `${this.model.title}`;

      console.log(`title: ${title}`);


      return title ?? 'SKA';
    },
	},

	methods: {
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
      if(dateString) {
        const [day, month, year] = dateString.split('-');
        const formattedDate = `${year}-${month}-${day}`;
        const date = new Date(formattedDate);

        if (isNaN(date.getTime())) {
          return 'Неверная дата';
        }

        const options = {day: 'numeric', month: 'long'} as any;
        return date.toLocaleDateString('ru-RU', options);
      }
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
.event-desktop {
  .info-block {
    width: 304px;
    padding: 32px 32px 48px 32px;
    border-radius: 20px;
  }
}
</style>
