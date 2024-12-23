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
          <heroicon @click="showMenu" class="cursor-pointer" name="burger" fill="currentColor" stroke="currentColor"/>
          <!-- <img width="32" height="32" src="/images/theme.svg" :class="{ 'rotate-animation': rotateAnimation, 'rotate': $vuetify.theme.dark }"/> -->
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
      searchDialog: false
    };
  },
  computed: {
    ...mapStores( useAppStore ),
  },
  methods: {
    scrollToBottom() {
      const destinationElement = document.body;
      if (destinationElement) {
        window.scrollTo({
          top: document.body.offsetHeight,
          behavior: 'smooth'
        });
      }
    },

    showMenu() {
      this.$modal.show('menu-modal', 'MobileAsideMenu');
    },
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

.right-menu {
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
