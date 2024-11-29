<template>
  <footer id="footer">
    <section class="row-1" style="display: flex; align-items: center; justify-content: space-between;">
      <div class="logo">
        <img src="/images/logo-kipish.svg" width="200px" alt="">
      </div>
      <div style="display: flex; align-items: center; gap:2em;">
        <div class="nav-links">
          <span v-for="link of links" :key="link.title" class="nav-link">
            <router-link v-if="link.href" :to="link.href" style="text-decoration:none; color:inherit;" >{{ link.title }}</router-link>
            <span v-else @click="link.onClick">{{ link.title }}</span>
          </span>
        </div>
        <div class="up" @click="goTo"
          style="
          border-radius:50%;
          width:74px !important;
          height:74px !important;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #EFEFEF;
        ">
          <div style="width: 32px;height: 32px">
            <img src="/icons/ArrowTop.svg"/>
          </div>
        </div>
      </div>
    </section>

    <section class="row-2">
      <div class="contacts">
        <div>
          <div class="title">Контакты</div>
          <div>+996 (504) 443444</div>
        </div>
        <div>
          <div class="title">Email</div>
          <div>info@kipish.kg</div>
        </div>
      </div>
      <div class="socials">
        <a target="_blank" href="https://www.youtube.com/channel/UCaHkOh9c7dgps2aC4EbShSA" class="social-button" style="display:inline-block; border-radius:50%; width:40px; height:40px; border:1px solid rgba(0, 0, 0, 0.1); background-position: center center; background-size:auto calc(100% - 25px); background-image:url('/images/socials/youtube.svg');"></a>
        <a target="_blank" href="https://wa.me/996504443444" class="social-button" style="display:inline-block; border-radius:50%; width:40px; height:40px; border:1px solid rgba(0, 0, 0, 0.1); background-position: center center; background-size:auto calc(100% - 20px); background-image:url('/images/socials/whatsapp.svg');"></a>
        <a target="_blank" href="https://www.instagram.com/kipishkg/" class="social-button" style="display:inline-block; border-radius:50%; width:40px; height:40px; border:1px solid rgba(0, 0, 0, 0.1); background-position: center center; background-size:auto calc(100% - 25px); background-image:url('/images/socials/instagram.svg');"></a>
      </div>
    </section>

    <section class="row-3" style="
      font-size:14px;
      color:#454545;
      font-weight:300;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding-top:2em;
      margin-top:2em;
      border-top:1px solid rgba(17, 17, 17, 0.1);">
      <div>© 2024. Все права защищены</div>
      <div>Политика конфидециальности</div>
      <div><a target="_blank" href="https://paleo.studio/">Developed by paleo</a></div>
    </section>
  </footer>
</template>

<script lang="ts">
import { useAppStore } from '@/stores';
import { mapStores } from 'pinia';
// import {mapActions, mapGetters} from "vuex";
// import Search from "@/views/other/Search.vue";

export default {
  name: "AppFooter",
  data() {
    return {
      links: [
        {href: '/reports',                title: 'Фото',              icon: 'mdi-camera'},
        {href: '/videos',                 title: 'Видео',             icon: 'mdi-video'},
        {href: '/events',                 title: 'События',           icon: 'mdi-calendar'},
        {href: '/establishments',         title: 'Заведения',         icon: 'mdi-glass-wine'},
        {onClick: ()=>{},                 title: 'Контакты',          icon: 'mdi-phone-message'},
        {href: '/feedback',               title: 'Заказать съемку',   icon: 'mdi-video-marker'},
        // {href: '/news',                                  title: 'Новости',           icon: 'mdi-camera'},
      ],
    };
  },
  computed: {
    ...mapStores( useAppStore ),
  },
  methods: {

  },
  created() {

  },
};
</script>

<style lang="scss">
#footer {
  padding:4em 10em;
  background: white;

  .row-1 {
    .logo {

    }
    div {
      .nav-links {
        display: flex;
        align-items: center;
        gap: 32px;

        .nav-link {
          font-size:18px;
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
    }
  }

  .row-2 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:5em 0;
    .contacts {
      display: flex;
      gap: 3em;
      .title {
        font-size:10px;
        font-weight:200;
      }
    }
    .socials {
      display: flex;
      align-items: center;
      gap: 16px;

      >:hover {
        background-color:rgb(18 18 18 / 10%);
      }
    }
  }


}
</style>
