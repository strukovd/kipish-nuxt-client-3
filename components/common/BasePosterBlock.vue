<template>
  <div class="base-poster-block">
    <!-- <div style="position: absolute;width: 100%;height: 100%; background: #28282880;z-index: 998 !important;"></div>
    <v-img style="z-index: 997 !important;position: absolute; object-fit: cover !important;" height="100%" width="100%" lazy-src="/static/images/cover-2.jpg" :data-src="`https://files.kipish.kg/${poster.coverPath}`" :src="`https://files.kipish.kg/${poster.coverPath}`"/>
    <div style="position: absolute;z-index: 999 !important;width: 100%;height: 100%;">
      <v-row style="height: 100%" class="pa-0 ma-0">
        <v-col cols="6" class="mt-100 d-flex flex-column justify-space-between pb-9 pt-11 px-12">
          <div class="d-flex flex-column">
            <span v-if="poster.date && !poster?.options?.hideDate" class="text-22 white--text opacity-70 font-weight-200">{{formatDate(poster.date)}}</span>
            <span v-if="!poster?.options?.hideTitle" @click="$router.push('/event/' + poster.posterId)" class="text-48 font-weight-720 white--text cursor-pointer text-uppercase mt-3 link_event">{{poster.title}}</span>
          </div>
          <div v-if="!poster?.options?.hideDescription" class="d-flex">
            <span v-html="poster.description" class="text-20 opacity-70 white--text"></span>
          </div>
        </v-col>
        <v-col cols="6" class="d-flex justify-end py-9 pr-12">
          <div class="d-flex flex-column justify-space-between">
            <div v-if="!poster?.options?.hideEstablishment" class="d-flex flex-column">
              <span class="text-22 font-weight-200 opacity-70 white--text">Место проведения/</span>
              <span class="text-uppercase text-32 font-weight-550 white--text mt-3">{{poster?.establishment?.name}}</span>
            </div>
            <v-spacer/>
            <div class="d-flex flex-column align-end">
              <div class="d-flex align-end">
                <span class="text-44 font-weight-550 white--text mr-1">{{ currentSlideMedia }}/</span>
                <span style="color: #4D4E4D" class="text-20 font-weight-550">{{posters.length}}</span>
              </div>
              <div class="mt-2 d-flex align-center">
                <v-img width="40" height="40" @click="customPrevMedia" class="mr-4 cursor-pointer" src="/images/icons/ArrowLeft.svg"/>
                <v-img width="40" height="40" @click="customNextMedia" class="cursor-pointer" src="/images/icons/ArrowRight.svg"/>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div> -->
  </div>
</template>

<script>
export default {
  props: {
    poster: Object
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">

</style>
