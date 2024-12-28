<template>
  <footer id="footer-mobile">
    <section class="row-1" style="display: flex; align-items: center; justify-content: space-between;">
      <div class="logo">
        <img src="/images/logo-kipish.svg" width="200px" alt="">
      </div>
      <div style="display: flex; align-items: center; gap:2em;">
        <div class="up" @click="scrollToTop"
          style="border-radius:50%; width:74px !important; height:74px !important; cursor: pointer; display: flex; align-items: center; justify-content: center; background: #EFEFEF;">
          <div style="width: 32px;height: 32px">
            <img src="/icons/ArrowTop.svg"/>
          </div>
        </div>
      </div>
    </section>

    <section class="nav-links">
      <span v-for="link of appStore.links" :key="link.title" class="font-text nav-link">
        <router-link v-if="link.href" :to="link.href" style="text-decoration:none; color:inherit;" >{{ link.title }}</router-link>
        <span v-else-if="link.onClick" @click="appStore.handleLinkClick(link)">{{ link.title }}</span>
      </span>
    </section>

    <section class="contacts">
      <div>
        <div class="title font-text">Контакты</div>
        <div>+996 (504) 443444</div>
      </div>
      <div>
        <div class="title font-text">Email</div>
        <div>info@kipish.kg</div>
      </div>
    </section>

    <section class="socials">
      <a target="_blank" href="https://www.youtube.com/channel/UCaHkOh9c7dgps2aC4EbShSA" class="social-button" style="display:inline-block; border-radius:50%; width:40px; height:40px; border:1px solid rgba(0, 0, 0, 0.1); background-position: center center; background-size:auto calc(100% - 25px); background-image:url('/images/socials/youtube.svg');"></a>
      <a target="_blank" href="https://wa.me/996504443444" class="social-button" style="display:inline-block; border-radius:50%; width:40px; height:40px; border:1px solid rgba(0, 0, 0, 0.1); background-position: center center; background-size:auto calc(100% - 20px); background-image:url('/images/socials/whatsapp.svg');"></a>
      <a target="_blank" href="https://www.instagram.com/kipishkg/" class="social-button" style="display:inline-block; border-radius:50%; width:40px; height:40px; border:1px solid rgba(0, 0, 0, 0.1); background-position: center center; background-size:auto calc(100% - 25px); background-image:url('/images/socials/instagram.svg');"></a>
    </section>

    <section class="row-3">
      <div>© 2024. Все права защищены</div>
      <div>Политика конфидециальности</div>
      <div><a target="_blank" href="https://paleo.studio/">Developed by paleo</a></div>
    </section>
  </footer>
</template>

<script lang="ts">
import { useAppStore } from '@/stores';
import { mapStores } from 'pinia';
// import Search from "@/views/other/Search.vue";

export default {
  name: "AppFooter",
  data() {
    return {};
  },
  computed: {
    ...mapStores( useAppStore ),
  },
  methods: {
    scrollToTop() {
      const destinationElement = document.body;
      if (destinationElement) {
        window.scrollTo({
          top: document.body.offsetTop,
          behavior: 'smooth'
        });
      }
    }
  },
  created() {

  },
};
</script>

<style lang="scss">
#footer-mobile {
  padding:3em 2em;
  background: white;

  .row-1 {
    margin-bottom:2em;
    .logo {}
  }

  .nav-links {
    display: flex;
    flex-direction: column !important;
    gap: 1em;
    margin-bottom:2em;

    .nav-link {
      font-size:16px;
      color: #111111;
      cursor:pointer;
      font-weight:normal;
      user-select:none;
      position: relative;
      >a, >span {
        font-weight:300;
      }

      &::before {
        content: "";
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 0;
        height: 1px;
        background-color: #111111;
        transition: width 0.6s ease;
        clip-path: polygon(0 0, 0% 100%, 100% 100%, 100% 0);
      }
      &:hover::before {
        width: 100%;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
      }
    }
  }

  .contacts {
    display: flex;
    padding:1.6em 0 0 0;
    margin:1.6em 0 0 0;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    font-size:18px;
    color: #111111;
    flex-wrap: wrap;
    gap: 3em;

    .title {
      font-weight:200;
    }
  }

  .socials {
    display: flex;
    padding:1.6em 0 1.6em 0;
    margin:0 0 1.6em 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    align-items: center;
    gap: 16px;

    >:hover {
      background-color:rgb(18 18 18 / 10%);
    }
  }

  .row-3 {
    font-size: 18px;
    color: #454545;
    font-weight: 300;
    display: flex;
    flex-direction: column;
    gap: 1em;
    justify-content: space-between;
    margin-top: 2em;
  }
}
</style>
