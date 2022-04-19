<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';
import BackgroundThumbnail from '../components/BackgroundThumbnail.vue';
  //TODO: ALL LOGIC REMAINING
 //TODO: SETUP COMPONENT THAT RETRIEVES IMAGE URLS FROM BACKEND AND SETS THEM AS PROPS ON THE BACKGROUN THUMBNAIL
 const backgroundCollection:Ref< Array<string> > = ref([]);

// get all background colection from electron
window.ipcRenderer.invoke('getBackgrounds', 'getBackgrounds').then((collection) => {
  backgroundCollection.value = collection;
});
</script>

<template>
  <div class="h-screen w-screen bg-zinc-800">
    <div class="flex gap-16 grow flex-wrap basis-1/4 h-full">
      <BackgroundThumbnail 
        v-for="(background, index) in backgroundCollection" 
        :key="`background-${index}`" 
        :background="background"
      />
    </div>
  </div>
</template>
