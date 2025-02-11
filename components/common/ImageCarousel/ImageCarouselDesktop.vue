<template>
  <section class="images-slider">
    <div v-for="(image, index) of images" :key="index"
         style="position:relative; overflow:hidden; border-radius:20px; flex:auto 1 0; width:480px; height:326px;"
         class="cursor-pointer">
      <img alt="img" style="width:480px; height:326px; object-fit:cover; overflow:hidden" :src="image.url"/>
    </div>
  </section>
</template>

<script lang="ts">

export default {
  name: 'ImageCarouselDesktop',
  props: {
    width: {type: Number, default: 0},
    height: {type: Number, default: 0},
    data: {type: Array, default: () => []},
  },
  data() {
    return {
      images: [
        {url: '/images/marq/1.jpg'},
        {url: '/images/marq/2.jpg'},
        {url: '/images/marq/3.jpg'},
        {url: '/images/marq/4.jpg'},
        {url: '/images/marq/5.jpg'},
        {url: '/images/marq/6.jpg'},
        {url: '/images/marq/7.jpg'},
        {url: '/images/marq/8.jpg'},
      ],
      dialog: false,
      selectedImage: null as any,
    };
  },
};
</script>

<style lang="scss">
.images-slider {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 1em;
  animation: scroll 20s linear infinite;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
