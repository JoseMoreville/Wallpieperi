<script lang="ts" setup>
import { useHead } from '@vueuse/head';
useHead({
  title: `Upload Background`,
});

function openDialog():void {
  window.ipcRenderer.invoke('openDialog', 'openDialog');
}
</script>

<template>
  <div class="h-screen w-screen bg-zinc-800">
    <div class="flex gap-16 grow flex-wrap basis-1/4 h-full justify-center">
      <button 
        class="text-white w-48 h-16 font-bold rounded-lg bg-violet-600 self-center hover:bg-gradient-to-t hover:from-violet-600 hover:to-fuchsia-500"
        @click="openDialog"
      > 
        Upload background 
      </button>
    </div>
  </div>
</template>
 