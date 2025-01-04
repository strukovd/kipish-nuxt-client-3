<template>
  <div class="calendar-modal">
    <v-date-picker
      :weekdays="[1, 2, 3, 4, 5, 6, 7]"
      :weekday-format="getDay"
      hide-weekdays
      hide-header
      elevation="0" locale="ru-RU"
      v-model="currentDate"
      color="#333333"
      @update:model-value="close(currentDate)"
      style="border-radius:12px; width:100%;"
      outlined />

    <BaseButton prependIcon="mdi-close" @click="close" class="mt-4">Закрыть</BaseButton>
    <!-- <v-btn depressed @click="close" style="border-radius: 16px !important;width: 100%" color="#CCCCCC80" class="py-8 px-15 hover-red mt-4">
      <span class="text-20 white--text opacity-70">Закрыть</span>
    </v-btn> -->
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import BaseButton from '../common/BaseButton.vue';

export default defineComponent({
  components: { BaseButton },
  props: ['payload'],
  computed: {
    ...mapStores( useAppStore ),
  },

  data() {
    return {
      currentDate: new Date(),
    };
  },

  created() {
    // this.currentDate = new Date().toLocaleDateString("fr-CA");
  },

  methods: {
    getDay(date: any) {
      const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
      let i = new Date(date)
        .toLocaleString('ru-RU', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
      return daysOfWeek[i];
    },

    close(resValue?: any) {
      const appStore = useAppStore();
      if (appStore) {
        const modal = appStore.modals.pop();
        if(modal && modal.resolve) modal?.resolve(resValue);
      }
    }
  },
});
</script>

<style lang="scss">
.calendar-modal {
  margin: auto;

  .dark-theme .v-picker__body >div{
    background: #1e1e1e;
  }

  .v-picker--date {
    // .v-picker__title {
    //   .v-date-picker-title {
    //     display: flex !important;
    //     justify-content: center;
    //     flex-direction: row !important;
    //     gap: 1em;
    //     flex-wrap: wrap;
    //     line-height: 1;
    //     display: flex;
    //     flex-direction: column;

    //     .v-date-picker-title__year {
    //       text-align: center;
    //       // display: block;
    //       font-size: 2em;
    //       opacity: 0.9;
    //       margin: auto 0 auto auto;
    //       // display: flex;
    //     }
    //     .v-date-picker-title__date {
    //       text-align: center;
    //       font-size: 1.6em;
    //       opacity: 0.6;
    //       padding: 0;
    //       margin: auto auto auto 0;
    //       display: flex;

    //       &:not(:empty)::before {
    //         content: '';
    //         display: block;
    //         width: 1px;
    //         height: 1em;
    //         margin: 0 .5em 0 0;
    //         background-color: #bfc7c7;
    //         opacity: 0.6;
    //       }
    //     }
    //   }
    // }
    .v-picker__body {
      background-color: currentColor;
      >div {
        // background: #1e1e1e;
      }
      .v-date-picker-header {
        font-weight: 400 !important;
      }
      .v-date-picker-table {
        th {
          font-size:.9em;
          font-weight:500;
          color: #bfc7c7;
        }

        td {
          button {
            border-radius: 4px;
          }
          .v-date-picker-table__current {
            // border-color:#FE252E99;
            background-color: #FE252E;
            color: whitesmoke !important;
            font-weight:600;
            border-color: #FE252E;
          }
        }
      }
    }
  }
}
</style>
