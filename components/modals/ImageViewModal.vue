<template>
  <div class="view-container">
    <aside v-show="appStore.viewedPhoto.currentIndex !== 0" class="arrow-left" @click="prevImage">
      <v-img width="40" height="40" src="/icons/ArrowLeft.svg"/>
    </aside>
    <div class="main-container">
      <div class="image">
        <img data-aos="fade-up" data-aos-duration="300" :style="{transform:`scale(${scale})`, maxHeight:'70vh'}" :src="src" alt="">
        <div class="close-button" @click="close"><v-icon color="white">mdi-close</v-icon></div>
      </div>
      <div class="functions">
        <div class="share-photo" v-if="showSharePhoto">
          <div>
            <button class="share-button whatsapp" @click="shareImage(`whatsapp`)" dark fab bottom color="green" small>
              <v-icon>mdi-whatsapp</v-icon>
            </button>
            <button class="share-button facebook" @click="shareImage(`facebook`)" dark fab bottom color="blue" small>
              <v-icon>mdi-facebook</v-icon>
            </button>
            <button class="share-button twitter" @click="shareImage(`twitter`)" dark fab bottom color="0088cc" small>
              <v-icon>mdi-twitter</v-icon>
            </button>
            <button class="share-button telegram" @click="shareImage(`telegram`)" dark fab bottom color="blue" small>
              <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24">
                <path
                  d="M9.78 18.65l.28-4.23l7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3L3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"
                  fill="white"/>
              </svg>
            </button>
          </div>
        </div>
        <BaseButton type="glass" @click="close">Скачать</BaseButton>
        <BaseButton type="glass" @click="showSharePhoto = !showSharePhoto"><Heroicon size="2em" name="share" fill="currentColor"/></BaseButton>
      </div>
    </div>
    <aside v-show="appStore.viewedPhoto.files.length-1 > appStore.viewedPhoto.currentIndex" class="arrow-right" @click="nextImage">
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
      const file = this.appStore.viewedPhoto.files[this.appStore.viewedPhoto.currentIndex];
      if (!file) return '';
      return `https://files.kipish.kg/${file.minioBucket}/min-${file.minioPath}`;
    },
  },

  data() {
    return {
      scale: 1,
      showSharePhoto: false
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

      this.appStore.viewedPhoto.files = [];
      this.appStore.viewedPhoto.currentIndex = 0;
      this.appStore.viewedPhoto.pagesIsOver = false;
    }
  },

  methods: {
    zoom() {
      if(this.scale < 3)
        this.scale++;
      else
        this.scale = 1;
    },

    shareImage(destination: string) {
      const image = this.appStore.viewedPhoto.files.find((el, index) => index === this.appStore.viewedPhoto.currentIndex);
      let baseUrl = '';

      if (process.env.NODE_ENV === 'production') {
        baseUrl = 'https://kipish.kg/image';
      } else {
        baseUrl = 'http://localhost:8084/image';
      }

      const imageUrl = `${baseUrl}/${image.id}`;

      let shareUrl;
      let curUrl = window.location.href;

      switch (destination) {
        case 'whatsapp':
          shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(imageUrl)}`;
          break;
        case 'telegram':
          shareUrl = `https://t.me/share/url?url=${encodeURIComponent(imageUrl)}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`;
          break;
        case 'twitter':
          let shareText = 'Kipish.kg';
          shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(imageUrl)}&text=${encodeURIComponent(shareText)}`;
          break;
      }

      window.open(shareUrl, '_blank');
    },

    nextImage() {
      const index = this.appStore.viewedPhoto.currentIndex;
      if (index < this.appStore.viewedPhoto.files.length-1) {
        this.appStore.viewedPhoto.currentIndex++;

        // Если просматриваемая фотография (почти) последняя и не все фотографии еще загружены
        if (index === this.appStore.viewedPhoto.files.length - 3 && !this.appStore.viewedPhoto.pagesIsOver) {
          this.payload.loadMore();
        }
      }
    },

    prevImage() {
      const index = this.appStore.viewedPhoto.currentIndex;
      if (index > 0) {
        this.appStore.viewedPhoto.currentIndex--;
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
      display: flex;
      justify-content: center;
      position: relative;
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
        top: -1em;
        right: -1em;
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
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top:1em;
      gap: 1em;

      .share-photo {
        display:flex;
        justify-content:center;
        position:absolute;
        // left:0;
        // right:0;
        bottom:5em;
        z-index:9999;
        background-color:#FFFFFF55;
        border-radius:8px;
        padding:.3em;

        .share-button {
          border-radius: 50%;
          margin-right: 8px !important;
          margin-left: 8px !important;
          color: #fff;
          font-size: .75rem;
          box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12);
          height: 40px;
          width: 40px;

          display: inline-flex;
          justify-content: center;
          align-items: center;

          &.whatsapp { background-color: #25D366; }
          &.telegram { background-color: #0088cc; }
          &.twitter { background-color: #0088cc; }
          &.facebook { background-color: #3b5998; }
        }
      }
    }
  }
}
</style>
