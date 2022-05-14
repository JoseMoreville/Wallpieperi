<template>
  <div class="w-1/4 h-1/4 flex flex-col items-center gap-2 text-white text-xs group hover:cursor-pointer">
    <video
      v-if="extension === 'mp4' || extension === 'webm'"
      muted 
      loop
      class=" aspect-video w-full h-full rounded-lg object-cover antialiased group-hover:brightness-110 group-hover:shadow-lg  group-hover:shadow-violet-600/50 aspect-video	ring-1 ring-slate-600/5"
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
      class=" aspect-video w-full h-full rounded-lg object-cover antialiased group-hover:brightness-110 group-hover:shadow-lg  group-hover:shadow-violet-600/50 aspect-video	ring-1 ring-slate-600/5"
      @click="backgroundClick"
    >
    <p class="group-hover:text-violet-300 ">
      {{ props.name }}
    </p>
  </div>
</template>
<script lang="ts" setup>
// eslint-disable-next-line
const props = defineProps<{
  background: string;
  name?: string;
  screen: number;
}>();
// eslint-disable-next-line
const emit = defineEmits(['backgroundName']);
const extension = props.background.split(".").pop();

function backgrounHover(event: MouseEvent) {
  (event.target as HTMLVideoElement)?.play();
}
function backgroundLeave(event: MouseEvent) {
  (event.target as HTMLVideoElement)?.pause();
  (event.target as HTMLVideoElement).currentTime = 0;
}
function backgroundClick() {
  const data = {[props.screen]: props.background};
  console.log(data);
  window.ipcRenderer.invoke('changeBackground', data);
  //window.ipcRenderer.invoke('changeBackground', props.background);
  emit('backgroundName', props.background);
}
</script>
