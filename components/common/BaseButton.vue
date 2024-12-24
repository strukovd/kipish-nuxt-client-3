<template>
  <button type="button" class="base-button" :class="[{ 'disabled': disabled }, 'thin-button']">
    <!-- <v-icon v-if="prependIcon" :icon="prependIcon" size="1.2em" style="margin-right:.3em; opacity:.8;"></v-icon> -->
    <slot name="default"></slot>
    <!-- <span style="display:flex; align-items:center; gap:.6em;"></span> -->
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseButton',
  props: {
    prependIcon: String,
    disabled: { type: Boolean, default: false },
    color: String
  },
  data() {
    return {};
  },
  methods: {},
});
</script>

<style lang="scss">
.base-button {
  &.small-button {
    color: #111111;
    border:1px solid rgba(0, 0, 0, 0.3);
    border-radius: 16px;
    padding:34px 40px;
    display: inline-block;
    font-weight: 500;
    letter-spacing: 0.0892857143em;
    max-width: 100%;
    outline: none;
    position: relative;
    text-decoration: none;
    text-indent: 0.0892857143em;
    text-transform: uppercase;
    user-select: none;
    vertical-align: middle;
    transition:all 0.3s ease-in-out 0s;
    font-size: 16px;
    line-height: 20px;

    &:hover {
      background-color: #fe252e;
      color: #f9f9f9;
    }
  }

  &.thin-button {
    font-family:"ALS Hauss VF", sans-serif;
    font-weight: 400;
    font-size:20px;
    color: #111111;
    border:1px solid rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding:.2em 1.6em;
    letter-spacing: 0.0892857143em;
    max-width: 100%;
    outline: none;
    position: relative;
    text-decoration: none;
    text-indent: 0.0892857143em;
    text-transform: uppercase;
    user-select: none;
    transition:all 0.3s ease-in-out 0s;

    display: flex;
    justify-content: center;
    width: 100%;
    align-items: center;
    gap: .6em;
    line-height: 2em;
    margin-right: .3em;


    &:hover {
      background-color: #fe252e;
      color: #f9f9f9;
    }
  }

  &.disabled {
    background: #ffffff55;
    color: #c5c5c5;
    border: 1px solid #e5e5e5;
    cursor: inherit;
    pointer-events: none;
  }

  &:not(.disabled) {
    cursor: pointer;
  }
}


</style>
