<script lang="ts" setup>
/* eslint-disable no-unused-vars */
import { ref, onMounted, provide, computed } from "vue";
import BackgroundCollection from "./views/BackgroundCollection.vue";
import BackgroundUploader from "./views/BackgroundUploader.vue";
import store from "./store/store";

const video = ref(null);
let extension = ref("");
const isMainRoute = ref(false);
provide<typeof store>("store", store);

if (!window.location.href.includes("changeBackground") || !document.getElementsByTagName("title")[0].innerText.includes("changeBackground")) {
  isMainRoute.value = true;
}
const isChangeBackgroundRoute = computed(() =>
  window.location.href.includes("changeBackground") || document.getElementsByTagName("title")[0].innerText.includes("changeBackground"),
);
const isUploadBackgroundRoute = computed(() =>
  window.location.href.includes("upload") || document.getElementsByTagName("title")[0].innerText.includes("Upload"),
);

onMounted(() => {
  if (
    !isChangeBackgroundRoute.value &&
    !isUploadBackgroundRoute.value
  ) {
    window.ipcRenderer
      .invoke("getBackground", "getBackground")
      .then((backgroundLocation) => {
        extension.value = backgroundLocation.split(".").pop();
        store.mutations.changeCurrentBackground(`file://${backgroundLocation}`);
      });
  }
});
</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <div v-if="isMainRoute">
      <video
        v-if="extension === 'mp4' || extension === 'webm'"
        ref="video"
        autoplay
        loop="true"
        muted="true"
        :type="extension === 'webm' ? 'video/webm' : 'video/mp4'"
        :src="store.state.currentBackground"
        class="object-cover antialiased w-screen h-screen"
      />
      <img
        v-if="extension === 'jpg' || extension === 'png'"
        :src="store.state.currentBackground"
        class="object-cover antialiased w-screen h-screen"
      >
    </div>
    <BackgroundCollection v-if="isChangeBackgroundRoute" />
    <BackgroundUploader v-if="isUploadBackgroundRoute" />
  </div>
</template>

<style></style>
