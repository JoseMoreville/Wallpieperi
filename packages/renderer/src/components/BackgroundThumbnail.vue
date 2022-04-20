<template>
  <video
    v-if="extension === 'mp4' || extension === 'webm'"
    muted 
    loop
    class=" w-1/4 h-1/4 rounded-lg object-cover antialiased hover:brightness-110 hover:shadow-lg  hover:shadow-violet-600/50 aspect-video	ring-1 ring-slate-600/5"
    :src="props.background" 
    :type=" extension === 'webm' ? 'video/webm' : 'video/mp4'"
    alt=""
    @mouseover="backgrounHover"
    @mouseout="backgroundLeave"
    @click="backgroundClick"
  />
  <img 
    v-if="extension === 'jpg' || extension === 'png'"
    :src="props.background"
    class=" w-1/4 h-1/4 rounded-lg object-cover antialiased hover:brightness-110 hover:shadow-lg  hover:shadow-violet-600/50 aspect-video	ring-1 ring-slate-600/5"
    @click="backgroundClick"
  >
</template>
<script lang="ts" setup>
// eslint-disable-next-line
const props = defineProps<{
  background: string;
}>();

const extension = props.background.split(".").pop();

function backgrounHover(event: MouseEvent) {
  (event.target as HTMLVideoElement)?.play();
}
function backgroundLeave(event: MouseEvent) {
  (event.target as HTMLVideoElement)?.pause();
}
function backgroundClick() {
  window.ipcRenderer.invoke('changeBackground', props.background);
}
</script>
