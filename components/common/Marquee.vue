<template>
  <div>
    <template v-if="windowWidth > 1400">
      <VueMarqueeSlider id="marquee-slider-text" :space="20" :speed="5000" :width="1275">
        <span style="font-weight:300; font-size:82px; text-transform:uppercase;" class="font-title">{{ text }}</span>
      </VueMarqueeSlider>
    </template>
    <template v-if="windowWidth <= 1400">
      <VueMarqueeSlider id="marquee-slider-text" :space="10" :speed="5000" :width="510">
        <span style="font-size:32px; line-height:42px; text-transform:uppercase;" class="font-title">{{ text }}</span>
      </VueMarqueeSlider>
    </template>
  </div>
</template>
<script>
import { mapState } from 'pinia';
import { VueMarqueeSlider } from 'vue3-marquee-slider';
import '@/node_modules/vue3-marquee-slider/dist/style.css';


export default {
  props: {
    text: {type: String, default: ''},
  },
  components: { VueMarqueeSlider },
  computed: {
    ...mapState(useAppStore, ['windowWidth'])
  },
  data() {
    return {};
  },
}
</script>
<style>
.marquee {
  width: 1440px;
  position: absolute;
  overflow: hidden;
  white-space: nowrap;
}

.marquee-content {
  display: inline-block;
  will-change: transform; /* Для повышения производительности */
  animation: marquee 10s linear infinite; /* Увеличиваем скорость */
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
