<template>
  <header id="header">
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
        <div class="nav-links">
          <span v-for="link of appStore.links" :key="link.title" class="nav-link">
            <router-link v-if="link.href" :to="link.href" style="text-decoration:none; color:inherit;" >{{ link.title }}</router-link>
            <span v-else @click="link.onClick">{{ link.title }}</span>
          </span>
        </div>
        <!-- <heroicon @click="()=>{}" class="cursor-pointer" name="search" fill="$vuetify.theme.dark ? '#FFFFFF' : '#111111'"/> -->
        <div class="cursor-pointer ml-8">
          <img width="32" height="32" src="/images/theme.svg" :class="{ 'rotate-animation': rotateAnimation, 'rotate': appStore.isDark }"/>
        </div>
      </section>
    </div>
  </header>
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
.scrolled #header {
  position:fixed;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(30px);
  height: 70px;
  padding:0 20px;

  .header-content {
    border-bottom:none;
  }
}

#header {
  position:sticky;
  top:0;
  width: 100%;
  height:110px;
  z-index:9999;
  transition: all 0.5s ease-in-out;

  .header-content {
    max-width:1300px;
    margin:0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

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
