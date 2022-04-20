<script lang="ts" setup>
import { ref } from 'vue';
import type { Ref } from 'vue';
import BackgroundThumbnail from '../components/BackgroundThumbnail.vue';
 const backgroundCollection:Ref< Array<string> > = ref([]);

// get all background colection from electron
window.ipcRenderer.invoke('getBackgrounds', 'getBackgrounds').then((collection) => {
  backgroundCollection.value = collection;
});

</script>

<template>
  <div class="h-screen w-screen bg-zinc-800 flex flex-col justify-center">
    <h1 class="text-white text-3xl font-bold self-center mt-8">
      Upload a 
      <span class="text-transparent bg-clip-text bg-gradient-to-t from-violet-600 to-fuchsia-500">background</span>
    </h1>
    <div class="flex gap-8 grow flex-wrap basis-1/4 h-1/4 w-10/12 justify-around bg-zinc-700/40 self-center rounded-lg overflow-y-auto my-8 p-8">
      <BackgroundThumbnail 
        v-for="(background, index) in backgroundCollection" 
        :key="`background-${index}`" 
        :background="background"
      />
    </div>
  </div>
</template>

<style scoped>
* {
    box-sizing: border-box;
  }
::-webkit-scrollbar {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 2em;
}
::-webkit-scrollbar-thumb:hover {
  background: #111;
}

</style>