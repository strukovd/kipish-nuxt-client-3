<template>
  <div class="view-container">
    <aside class="arrow-left"></aside>
    <div class="main-container">
      <div class="image">
        <img @click="zoom" :style="{cursor:'zoom-in', transform: `scale(${scale})`}" :src="src" alt="">
      </div>
      <div class="functions">
        <BaseButton @click="close">Скачать</BaseButton>
        <BaseButton @click="close"><Heroicon name="share"/></BaseButton>
      </div>
    </div>
    <aside class="arrow-right"></aside>
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import BaseButton from '../common/BaseButton.vue';

export default defineComponent({
  props: ['payload'],
  components: { BaseButton },
  computed: {
    ...mapStores( useAppStore ),

    src() {
      const file = this.payload.files[this.payload.index];
      if (!file) return '';
      return `https://files.kipish.kg/${file.minioBucket}/min-${file.minioPath}`;
    },
  },
  data() {
    return {
      scale: 1,
    };
  },
  methods: {
    zoom() {
      if(this.scale < 3)
        this.scale++;
      else
        this.scale = 1;
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
.view-container {
  display: flex;
  height:600px;
  max-width:1300px;
  max-height:100vh;
  margin:0 auto;

  .arrow-left, .arrow-right {
  }

  .main-container {

    .image {
      max-width: 100%;
      max-height: 100%;
      // overflow: auto;
      // padding: 0 2em;

      img {
        max-width: 100vw;
        max-height: 100vh;
        object-fit: scale-down;
      }
    }
    .functions {

    }
  }
}
</style>
