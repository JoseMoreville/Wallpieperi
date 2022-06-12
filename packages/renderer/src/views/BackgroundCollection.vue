<script lang="ts" setup>
import { ref, defineProps } from 'vue';
import type { Ref } from 'vue';
import BackgroundThumbnail from '../components/BackgroundThumbnail.vue';

import { useHead } from '@vueuse/head';
useHead({
  title: `Change Background`,
});
const backgroundCollection:Ref< Array<string> > = ref([]);
const currentScreen = ref(1);
const selectedBackground = ref('');
const props = defineProps<{
  numberOfScreens: number;
}>();
// get all background collection from electron
window.ipcRenderer.invoke('getBackgrounds', 'getBackgrounds').then((collection) => {
  backgroundCollection.value = collection;
});

function getName(background: string):string {
  const name = background.split('/').pop()?.split('.').shift();
  return name || 'No name';
}

function changeCurrentScreen(screen:number){
  currentScreen.value = screen;
}
</script>

<template>
  <div class="bg-zinc-800 flex flex-col justify-center w-auto h-full">
    <h1 class="text-white text-3xl font-bold self-center">
      Change
      <span class="text-transparent bg-clip-text bg-gradient-to-t from-violet-600 to-fuchsia-500">background</span>
    </h1>

    <div class="flex flex-wrap p-4 gap-2 self-center">
      <div 
        v-for="screen in props.numberOfScreens" 
        :key="screen"
        class="bg-violet-600 w-32 h-24 flex flex-col items-center justify-center rounded-md text-white text-xs group hover:cursor-pointer"
        :class="currentScreen === screen ? 'bg-violet-800 shadow-lg' : ''"
        @click="changeCurrentScreen(screen)"
      >
        <p>{{ screen }}</p>
      </div>
    </div>

    <div class=" h-full flex gap-8 grow flex-wrap basis-1/4 h-1/4 w-10/12 justify-around bg-zinc-700/40 self-center rounded-lg overflow-y-auto p-8 min-h-[70%]">
      <BackgroundThumbnail 
        v-for="(background, index) in backgroundCollection" 
        :key="`background-${index}`" 
        :background="background"
        :name="getName(background)"
        :screen="currentScreen"
        @background-name="backgroundName=> selectedBackground = backgroundName "
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