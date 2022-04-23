<script lang="ts" setup>
/* eslint-disable no-unused-vars */
import { ref, provide, computed, type Ref } from "vue";
import BackgroundCollection from "./views/BackgroundCollection.vue";
import BackgroundUploader from "./views/BackgroundUploader.vue";
import store from "./store/store";
import useBackground from "./modules/helpers";

const isChangeBackgroundRoute = computed(() =>
  window.location.href.includes("changeBackground") || document.getElementsByTagName("title")[0].innerText.includes("changeBackground"),
);
const isUploadBackgroundRoute = computed(() =>
  window.location.href.includes("upload") || document.getElementsByTagName("title")[0].innerText.includes("Upload"),
);

const isMainRoute:Ref<boolean> = ref(!isChangeBackgroundRoute.value && !isUploadBackgroundRoute.value);

provide <typeof store>("store", store);

const {extension, shouldVideoBeMuted} = useBackground(isMainRoute,store);

</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <div v-if="isMainRoute">
      <video
        v-if="extension === 'mp4' || extension === 'webm'"
        id="video"
        autoplay
        loop="true"
        :muted="shouldVideoBeMuted"
        :type="extension === 'webm' ? 'video/webm' : 'video/mp4'"
        :src="store.state.currentBackground"
        class="w-screen h-screen pointer-events-none overflow-hidden "
        :class="extension === 'webm'? 'object-cover' : 'object-fill'"
      />
      <img
        v-if="extension === 'jpg' || extension === 'png'"
        :src="store.state.currentBackground"
        class="object-cover antialiased w-screen h-screen pointer-events-none overflow-hidden"
      >
    </div>
    <BackgroundCollection v-if="isChangeBackgroundRoute" />
    <BackgroundUploader v-if="isUploadBackgroundRoute" />
  </div>
</template>

<style></style>
