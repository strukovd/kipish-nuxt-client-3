<template>
  <div class="view-container">
    <aside v-show="payload.index !== 0" class="arrow-left" @click="prevImage">
      <v-img width="40" height="40" src="/icons/ArrowLeft.svg"/>
    </aside>
    <div class="main-container">
      <div class="image">
        <img data-aos="fade-up" data-aos-duration="300" @click="zoom" :style="{cursor:'zoom-in', transform: `scale(${scale})`}" :src="src" alt="">
        <div class="close-button" @click="close"><v-icon color="white">mdi-close</v-icon></div>
      </div>
      <div class="functions">
        <BaseButton type="glass" @click="close">Скачать</BaseButton>
        <BaseButton type="glass" @click="close"><Heroicon size="2em" name="share" fill="currentColor"/></BaseButton>
      </div>
    </div>
    <aside v-show="payload.files.length-1 > payload.index" class="arrow-right" @click="nextImage">
      <v-img width="40" height="40" src="/icons/ArrowRight.svg"/>
    </aside>
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

  created() {
    if( import.meta.browser ) {
      window.addEventListener('keydown', this.onKeydown);
    }
  },

  beforeUnmount() {
    if( import.meta.browser ) {
      window.addEventListener('keydown', this.onKeydown);
    }
  },

  methods: {
    zoom() {
      if(this.scale < 3)
        this.scale++;
      else
        this.scale = 1;
    },

    nextImage() {
      const index = this.payload.index;
      if (index < this.payload.files.length-1) {
        this.payload.index++;
      }
    },

    prevImage() {
      const index = this.payload.index;
      if (index > 0) {
        this.payload.index--;
      }
    },

    onKeydown(e: any) {
      if (e.key === 'ArrowLeft') {
        this.prevImage();
        // if (this.viewedImageId === 0) this.viewedImageId = this.files.length - 1;
        // else this.viewedImageId--;
      } else if (e.key === 'ArrowRight') {
        this.nextImage();
        // if (this.viewedImageId === this.files.length - 1) this.viewedImageId = 0;
        // else this.viewedImageId++;
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
.view-container {
  display: flex;
  // height:600px;
  max-width:1300px;
  max-height:100vh;
  margin:5em auto;

  .arrow-left, .arrow-right {
    position: absolute;
    top: 50%;
    margin: 0 1em;
    padding:0 1em;
    background-color: #ffffff4d;
    border-radius: 16px;
    width: 64px;
    height: 64px;
    z-index: 999;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:all 300ms ease 0s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.4);
    }
  }
  .arrow-left {
    left: 10vw;
  }
  .arrow-right {
    right: 10vw;
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
        object-fit: cover;
        height: 80vh;
        border-radius: 24px;
      }

      .close-button {
        position: absolute;
        top: -.2em;
        right: -.2em;
        cursor: pointer;
        background-color: #fe252e;
        border-radius: 50%;
        width: 56px;
        height: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .functions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1em;
    }
  }
}
</style>
