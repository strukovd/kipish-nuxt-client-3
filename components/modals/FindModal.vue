<template>
  <div class="find-container">
    <section class="close">
      <div @click="close" style="background: #FFFFFF99;border-radius: 50%;width: 60px;height: 60px" class="d-flex justify-center align-center cursor-pointer">
        <heroicon name="cross" fill="#000000B2"/>
      </div>
    </section>
    <section class="search-input">
      <v-text-field v-model="searchWord" @input="search" hide-details placeholder="ПОИСК"></v-text-field>
    </section>
    <v-divider class="mt-4"/>
    <section class="tags">
      <div class="tag" @click="activeTab = tab.value" :class="activeTab === tab.value && 'active'" v-for="tab in tabs">
        <span>{{ tab.name }}</span>
      </div>
    </section>
    <section class="results">
      <div class="mt-80 d-flex justify-center flex-wrap">
        <div @click="openResult(card)" v-for="card in result" v-if="activeTab === 'ALL'" class="result_card cursor-pointer">
          <span style="color:#111111" class="text-14 mb-3">{{ setTarget(card.target) }}</span>
          <span style="color:#111111" class="text-32">{{ card.name }}</span>
        </div>
        <div @click="openResult(card)" v-for="card in result.filter(el => el.target === activeTab)" v-if="activeTab !== 'ALL'" class="result_card cursor-pointer">
          <span style="color:#111111" class="text-14 mb-3">{{ setTarget(card.target) }}</span>
          <span style="color:#111111" class="text-32">{{ card.name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import BaseButton from '../common/BaseButton.vue';

export default defineComponent({
  props: ['payload'],
  computed: {
    ...mapStores( useAppStore ),
  },
  data() {
    return {
      searchWord: '',
      result: [] as any[],
      activeTab: 'ALL',
      tabs: [
        {name: 'Все', value: 'ALL'},
        {name: 'Репортажи', value: 'ALBUM'},
        {name: 'События', value: 'EVENT'},
        {name: 'Видео', value: 'VIDEO'},
        {name: 'Новости', value: 'POST'},
        {name: 'Фотографы', value: 'PHOTOGRAPHER'},
        {name: 'Анонсы', value: 'ANNOUNCEMENT'},
        {name: 'Заведения', value: 'ESTABLISHMENT'},
      ]
    };
  },
  methods: {
    search() {
      this.$http.get(`/search?search=${this.searchWord}`)
          .then(r => {
            this.result = r.data.content
          });
    },

    setTarget(target: string) {
      const targets = [
        {name: 'Репортаж', value: 'ALBUM'},
        {name: 'Событие', value: 'EVENT'},
        {name: 'Видео', value: 'VIDEO'},
        {name: 'Новость', value: 'POST'},
        {name: 'Фотограф', value: 'PHOTOGRAPHER'},
        {name: 'Анонс', value: 'ANNOUNCEMENT'},
        {name: 'Заведение', value: 'ESTABLISHMENT'},
      ]
      const res = targets.find(el => el.value === target)
      return res ? res.name : null;
    },

    openResult(card: any) {
      switch (card.target) {
        case 'ALBUM':
          navigateTo('/report/' + (!!card?.url?.url ? card.url.url : card.id));
          break;
        case 'ESTABLISHMENT':
          navigateTo('/establishment/' + card.id);
          break;
        case 'VIDEO':
          navigateTo('/video/' + card.id);
          break;
        case 'EVENT':
          navigateTo('/event/' + card.id);
          break;
        default:
          break;
      }
    },

    confirm() {
      const appStore = useAppStore();
      if (appStore) {
        const modal = appStore.modals.pop();
        if(modal && modal.resolve) modal?.resolve(true);
      }
    },

    close() {
      const appStore = useAppStore();
      if (appStore) {
        const modal = appStore.modals.pop();
        if(modal && modal.resolve) modal?.resolve(false);
      }
    }
  },
});
</script>

<style lang="scss">
.find-container {
  flex:auto 1 0;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height:600px;
  max-width:1300px;
  margin:auto;

  @media (min-width: 1300px) {
    /* Styles for screens larger than 1300px */
  }

  @media (max-width: 1300px) {
    padding:0 3em;
    max-width: 100vw;
  }

  .close {
    position: absolute;
    top: 0;
    right: 3em;
    cursor: pointer;
  }

  .search-input {
    width: 100%;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 40px;
    align-items: center;
    justify-content: center;
    gap: 1em;

    .tag {
      background: #fff;
      border-radius: 60px;
      padding: 0 2em;
      font-size: 20px;
      line-height:3em;
      color: #111;
      cursor: pointer;

      &.active {
        background: #fe252e;
        color: #fff;
      }
    }
  }
}
</style>
