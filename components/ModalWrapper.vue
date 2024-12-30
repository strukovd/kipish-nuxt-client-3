<template>
  <div class="modal-shadow" @keydown.esc="close" @pointerdown.self.stop.prevent="close" :style="{ background: visibleModal.options?.background }">
    <component :is="visibleModal.template" :payload="visibleModal.options?.payload"></component>
    <!--
    <div class="modal-window">
      <header class="modal-header">
        <h3>
          <v-icon v-if="visibleModal.options?.icon" color="cornflowerblue" :icon="visibleModal.options?.icon" size="1.2em"/>
          <span class="title">{{ visibleModal.title }}</span>
        </h3>
      </header>
      <nav></nav>
      <main class="main">
        <component :is="visibleModal.template" :payload="visibleModal.options?.payload"></component>
      </main>
      <footer class="footer"></footer>
    </div>
    -->
  </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import Confirm from '~/components/modals/ConfirmModal.vue';
import MobileAsideMenu from '~/components/modals/MobileAsideMenuModal.vue';
import Find from '~/components/modals/FindModal.vue';


export default {
  computed: {
    ...mapStores(useAppStore),
    visibleModal() {
      return this.appStore.modals[this.appStore.modals.length-1];
    }
  },
  components: { Confirm, MobileAsideMenu, Find },
  methods: {
    onKeydown(e: KeyboardEvent) {
      if( e.key === 'Escape' ) {
        this.close(e);
      }
    },

    close(e: Event) {
      if( !this.visibleModal?.options?.nonCloseable ) {
        this.appStore.modals.pop();
      }
    },
  },
  created() {
    window.addEventListener('keydown', this.onKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown);
  }
};
</script>

<style lang="scss">
.modal-shadow {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height:100vh;
  display: flex;
  backdrop-filter: blur(20px) !important;
  background-color: rgba(0, 0, 0, 0.2);
  z-index:9999999;

  // .modal-window {
  //   min-width:600px;
  //   max-width: 800px;
  //   margin:auto;
  //   background: white;
  //   border-radius:6px;

  //   .modal-header {
  //     border-radius:6px 6px 0 0;
  //     // color: #656565;
  //     border-bottom: 1px solid #e0e0e0;
  //     background: #f5f5f5;

  //     h3 {
  //       line-height: 3em;
  //       margin: 0 1em;
  //       font-size: 17px;
  //       font-weight: 500;

  //       .title {
  //         vertical-align:middle;
  //         margin-left:.6em;
  //       }
  //     }
  //   }

  //   .main {
  //     padding:.6em 1.8em 1em;
  //     overflow: auto;
  //     max-height: 90vh;
  //   }

  // }
}
</style>
