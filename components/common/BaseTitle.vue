<template>
  <div :class="{[`title-${type}`]: true}">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    type: {type: String, default: 'desktop' as 'mobile' | 'desktop'},
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss">
.title-mobile {
  &, & > * {
    font-family: 'ALS Gorizont', sans-serif !important;
    font-size: 32px;
    line-height:1.4em;
    text-transform: uppercase;
    font-weight: 300;
    margin-bottom:0;
  }
}

.title-desktop {
  &, & > * {
    font-family: 'ALS Gorizont', sans-serif !important;
    font-size: 68px;
    line-height:1.4em;
    text-transform: uppercase;
    font-weight: 300;
    margin-bottom:0;
  }
}
</style>
