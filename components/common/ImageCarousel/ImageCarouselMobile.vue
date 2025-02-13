<template>
  <div style="position: absolute;width: 100%;height: 100%">
    <vue-marquee-slider
        id="marquee-slider-loop"
        :speed="30000"
        :width="360"
        :space="24"
    >
      <div @click="openImage(index)" v-for="(image, index) in images"
           style="position: relative;overflow: hidden;border-radius: 12px;"
           :key="index"
           class="cursor-pointer">
<!--        <div style="background: #00000066;position: absolute;width: 360px;height: 280px;overflow: hidden"></div>-->
        <img
            alt=""
            width="100%"
            height="100%"
            style="background: #00000066;"
            :key="index"
            :src="image.url"
        />
      </div>
    </vue-marquee-slider>
    <v-dialog v-model="dialog" max-width="600">
      <v-img :src="selectedImage"/>
    </v-dialog>
  </div>
</template>

<script>

export default {
  name: 'ImageCarouselMobile',
  props: {
    width: {type: Number, default: 0},
    height: {type: Number, default: 0},
  },
  data() {
    return {
      images: [
        {url: '/static/images/marq/1.jpg'},
        {url: '/static/images/marq/2.jpg'},
        {url: '/static/images/marq/3.jpg'},
        {url: '/static/images/marq/4.jpg'},
        {url: '/static/images/marq/5.jpg'},
        {url: '/static/images/marq/6.jpg'},
        {url: '/static/images/marq/7.jpg'},
        {url: '/static/images/marq/8.jpg'},
      ],
      dialog: false,
      selectedImage: null,
    };
  },
  methods: {
    openImage(index) {
      console.log(index)
      this.selectedImage = this.images[index].url;
      this.dialog = !this.dialog;
    },
  },
};
</script>

<style scoped>

</style>
