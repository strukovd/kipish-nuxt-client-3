<template>
  <div class="view-container">
    <div class="arrow-left"></div>
    <div class="main-container">
      <div class="image"></div>
      <div class="functions"></div>
    </div>
    <div class="arrow-right">
      <BaseButton @click="close">Скачать</BaseButton>
      <BaseButton @click="close"><Heroicon name="share"/></BaseButton>
    </div>
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
    return {};
  },
  methods: {
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
.view-container {
  display: flex;
  height:600px;
  max-width:1300px;
  margin:auto;
}
</style>
