<template>
  <header id="header-mobile">
    <div class="header-content">
      <section class="left-side">
        <RouterLink to="/">
          <img src="/images/logo.svg" width="54px" alt="Logo">
        </RouterLink>
        <v-select class="city-select" :items="[{id: 1, nameRu: 'Бишкек'}]" item-title="nameRu" item-value="id" menu-icon="" return-object @change="()=>{}" v-model="appStore.currentCity" dense hide-details>
          <template v-slot:selection="{ item, index }">
            <div style="display:flex; align-items:center; gap:.2em;">
              <span>{{ item.raw.nameRu }}</span>
              <v-icon>mdi-menu-down</v-icon>
            </div>
          </template>
        </v-select>
      </section>
      <section class="right-side">
        <!-- <div class="nav-links">
          <span v-for="link of links" :key="link.title" class="nav-link">
            <router-link v-if="link.href" :to="link.href" style="text-decoration:none; color:inherit;" >{{ link.title }}</router-link>
            <span v-else @click="link.onClick">{{ link.title }}</span>
          </span>
        </div> -->
        <!-- <heroicon @click="()=>{}" class="cursor-pointer" name="search" fill="$vuetify.theme.dark ? '#FFFFFF' : '#111111'"/> -->
        <div class="cursor-pointer ml-8">
          <heroicon class="cursor-pointer" name="burger" :fill="appStore.isDark ? '#FFFFFF' : '#111111'" :stroke="appStore.isDark ? '#FFFFFF' : '#111111'"/>
          <!-- <img width="32" height="32" src="/images/theme.svg" :class="{ 'rotate-animation': rotateAnimation, 'rotate': $vuetify.theme.dark }"/> -->
        </div>
      </section>
    </div>
  </header>








  <!-- <div v-if="appStore.windowWidth <= 1400" style="height: 80px">
    <v-app-bar :style="appStore.isDark ? 'background-color: #171717' : 'background-color: #f5f5f5'" elevation="0" fixed height="80px" class="d-flex align-center justify-center">
      <v-card style="border-radius: unset !important; z-index: 999 !important;border-bottom: 1px solid #0000001A" elevation="0" class="d-flex align-center pa-0 " color="transparent">
        <v-card-text class="px-4 d-flex justify-space-between align-center pa-0 wrapper">
          <div class="d-flex align-center header_block">
            LOGO...
            CITIES...
          </div>
          <div @click="openMenu" class="d-flex align-center">
            <heroicon class="cursor-pointer" name="burger" :fill="appStore.isDark ? '#FFFFFF' : '#111111'"
                      :stroke="appStore.isDark ? '#FFFFFF' : '#111111'"/>
          </div>
        </v-card-text>
      </v-card>
    </v-app-bar>

    <v-navigation-drawer style="border-radius: 8px 0 0 8px; z-index: 999 !important; max-width:350px;" app width="75%" fixed
                          v-model="menu" right>
      <v-card elevation="0" color="transparent" height="100%">
        <v-card-text class="pa-0 px-6 pt-5 d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <div class="cursor-pointer" @click="$router.push('/')">
              <v-img width="37" height="36"
                      :src="$vuetify.theme.dark ? '/static/images/logo-light.svg' : '/static/images/logo.svg'"/>
            </div>
          </div>
          <div class="d-flex align-center">
            <heroicon @click="searchDialog = true" class="cursor-pointer mr-8" name="search"
                      :fill="$vuetify.theme.dark ? '#FFFFFF' : '#111111'"/>
            <v-img class="cursor-pointer" @click="toggleTheme" width="24" height="24"
                    src="/static/images/mode.svg"
                    :class="{ 'rotate-animation': rotateAnimation, 'rotate': $vuetify.theme.dark }"/>
          </div>
        </v-card-text>
        <v-card-text class="pl-6 pr-0 py-0 mt-10 pb-10">
          <div class="d-flex flex-column">
            <template v-for="link of [
                {href: '/reports',                title: 'Фото',              icon: 'mdi-camera'},
                {href: '/videos',                 title: 'Видео',             icon: 'mdi-video'},
                {href: '/events',                 title: 'События',           icon: 'mdi-calendar'},
                {href: '/establishments',         title: 'Заведения',         icon: 'mdi-glass-wine'},
                {onClick: scrollToContacts,       title: 'Контакты',          icon: 'mdi-phone-message'},
                {href: '/feedback',               title: 'Заказать съемку',   icon: 'mdi-video-marker'},
                // {href: '/news',                                  title: 'Новости',           icon: 'mdi-camera'},
              ]">
              <span class="black--text text-18 font-weight-regular mb-6 mr-8 cursor-pointer select-none">
                    <router-link v-if="link.href"
                          :to="link.href"
                          style="text-decoration:none; color:inherit;"
                    >{{ link.title }}</router-link>
                    <span v-else
                          @click="link.onClick"
                    >{{ link.title }}</span>
              </span>
            </template>
          </div>
          <v-divider style="color: #0000001A !important;" class="mt-10"/>
          <div class="mt-5">
            <div class="d-flex flex-column">
              <p class="black--text font-weight-300 text-12 mb-2 text-uppercase">
                Контакты</p>
              <p class="black--text text-16 mb-0"><a target="_blank" ref="noorefferer"
                                                      class="text-decoration-none black--text"
                                                      href="tel:+996504443444">+996 (504) 443444</a></p>
            </div>
            <div class="d-flex flex-column mt-8">
              <p class="black--text font-weight-300 text-12 mb-2 text-uppercase">Email</p>
              <p class="black--text text-16 mb-0"><a target="_blank" ref="noorefferer"
                                                      class="text-decoration-none black--text"
                                                      href="mailto:info@kipish.kg">info@kipish.kg</a></p>
            </div>
          </div>
          <div class="d-flex align-center mt-10">
            <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"
                  style="border-radius: 50%;width: 40px;height: 40px"
                  class="d-flex justify-center align-center mr-6 cursor-pointer">
              <a target="_blank" ref="noorefferer" class="text-decoration-none"
                  href="https://www.youtube.com/channel/UCaHkOh9c7dgps2aC4EbShSA">
                <div>
                  <v-img
                    :src="$vuetify.theme.dark ? '/static/images/social/yt-light.svg' : '/static/images/social/yt.svg'"/>
                </div>
              </a>
            </div>
            <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"
                  style="border-radius: 50%;width: 40px;height: 40px"
                  class="d-flex justify-center align-center mr-6 cursor-pointer">
              <a target="_blank" ref="noorefferer" href="https://wa.me/996504443444">
                <div>
                  <v-img
                    width="18" height="18"
                    :src="$vuetify.theme.dark ? '/static/images/social/whatsapp-light.svg' : '/static/images/social/whatsapp.svg'"/>
                </div>
              </a>
            </div>
            <div :style="$vuetify.theme.dark ? 'border: 1px solid #FFFFFF;' : 'border: 1px solid #0000001A;'"
                  style="border-radius: 50%;width: 40px;height: 40px"
                  class="d-flex justify-center align-center cursor-pointer">
              <a target="_blank" ref="noorefferer" href="https://www.instagram.com/kipishkg/">
                <div>
                  <v-img
                    width="18" height="18"
                    :src="$vuetify.theme.dark ? '/static/images/social/inst-light.svg' : '/static/images/social/inst.svg'"/>
                </div>
              </a>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-navigation-drawer>
  </div> -->
</template>

<script lang="ts">
import { useAppStore } from '@/stores';
import { mapStores } from 'pinia';
// import {mapActions, mapGetters} from "vuex";
// import Search from "@/views/other/Search.vue";

export default {
  name: "AppHeader",
  // components: {Search},
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
      rotateAnimation: false,
      cities: [],
      menu: false,
      searchDialog: false
    };
  },
  computed: {
    ...mapStores( useAppStore ),
  },
  methods: {
    // ...mapActions(['logout']),

    // scrollToContacts() {
    //   this.$router.push({hash: ""});
    //   const fullHeight = document.documentElement.scrollHeight;
    //   this.$vuetify.goTo(fullHeight);
    // },
    // openMenu() {
    //   this.menu = !this.menu
    // },
    // toggleTheme() {
    //   this.rotateAnimation = true;
    //   this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    //   localStorage.setItem('dark-theme', this.$vuetify.theme.dark);
    //   setTimeout(() => {
    //     this.rotateAnimation = false;
    //   }, 1000);
    // },

    // init() {
    //   this.loadCity();
    //   this.$http.get('/cities')
    //       .then(r => {
    //         this.cities = r.data.content;
    //         if (this.cities.length > 0 && !this.$store.state?.currentCity) {
    //           this.$store.state.currentCity = this.cities[0];
    //         }
    //       })
    // },

    // loadCity() {
    //   if (localStorage.getItem('city')) {
    //     const city = JSON.parse(localStorage.getItem('city'));
    //     this.$store.state.currentCity = city;
    //   }
    // },

    // onChangeCity() {
    //   localStorage.setItem('city', JSON.stringify(this.$store.state.currentCity));
    //   this.$router.go();
    // }
  },

  created() {
    // this.init();
  },
};
</script>

<style lang="scss">
.scrolled #header-mobile {
  position:fixed;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(30px);
  height: 70px;
  padding:0 20px;

  .header-content {
    border-bottom:none;
  }
}

#header-mobile {
  position:sticky;
  top:0;
  width: 100%;
  height:110px;
  z-index:9999;
  transition: all 0.5s ease-in-out;
  padding:0 2em;

  .header-content {
    max-width:1300px;
    margin:0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    // border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    .left-side {
      display:flex;
      align-items:center;

      .city-select {
        max-width: 200px;

        .v-field__overlay {
          background:none;
        }
        .v-field__outline {
          display:none;
        }
      }
    }

    .right-side {
      display:flex;

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
}
</style>
