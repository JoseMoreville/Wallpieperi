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
const isExternalScreen = computed(() =>
  window.location.href.includes("externalScreen") || document.getElementsByTagName("title")[0].innerText.includes("externalScreen"),
);
const isMainRoute:Ref<boolean> = ref(!isChangeBackgroundRoute.value && !isUploadBackgroundRoute.value);
const NUMBER_OF_SCREENS = ref(1);
const INSTANCE_SCREEN_ID = ref(1);
provide <typeof store>("store", store);
const backgroundVideo = ref(null);

try{
  window.ipcRenderer.invoke('getAllScreens').then(amount =>{
    NUMBER_OF_SCREENS.value = amount;
  });
  if(isExternalScreen.value){
    window.ipcRenderer.invoke('instanceId', 'instanceId').then((id)=>{
      if(id < 2)return;
      INSTANCE_SCREEN_ID.value = id;
  }); 
  }

}catch(e){
  console.log(e);
}
const {extension, shouldVideoBeMuted} = useBackground(isMainRoute,store, INSTANCE_SCREEN_ID);

</script>

<template>
  <div class="w-screen h-screen overflow-hidden">
    <div v-if="isMainRoute">
      <video
        v-if="(extension === 'mp4' || extension === 'webm') && INSTANCE_SCREEN_ID <= 1"
        id="video"
        ref="backgroundVideo"
        autoplay
        loop="true"
        :muted="shouldVideoBeMuted"
        :type="extension === 'webm' ? 'video/webm' : 'video/mp4'"
        :src="store.state.currentBackground[INSTANCE_SCREEN_ID]"
        class="w-screen h-screen pointer-events-none overflow-hidden "
        :class="extension === 'webm'? 'object-cover' : 'object-fill'"
      />
      <video
        v-if="(extension === 'mp4' || extension === 'webm') && INSTANCE_SCREEN_ID > 1"
        id="video"
        ref="backgroundVideo"
        autoplay
        loop="true"
        muted
        :type="extension === 'webm' ? 'video/webm' : 'video/mp4'"
        :src="store.state.currentBackground[INSTANCE_SCREEN_ID]"
        class="w-screen h-screen pointer-events-none overflow-hidden "
        :class="extension === 'webm'? 'object-cover' : 'object-fill'"
      />
      <img
        v-if="extension === 'jpg' || extension === 'png'"
        :src="store.state.currentBackground[INSTANCE_SCREEN_ID]"
        class="object-cover antialiased w-screen h-screen pointer-events-none overflow-hidden"
      >
    </div>
    <BackgroundCollection 
      v-if="isChangeBackgroundRoute" 
      :number-of-screens="NUMBER_OF_SCREENS"
    />
    <BackgroundUploader v-if="isUploadBackgroundRoute" />
  </div>
</template>

<style></style>
