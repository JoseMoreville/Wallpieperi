<script lang="ts" setup>
import { ref } from 'vue';
import BackgroundThumbnail from './BackgroundThumbnail.vue';
  //TODO: ALL LOGIC REMAINING
 //TODO: SETUP COMPONENT THAT RETRIEVES IMAGE URLS FROM BACKEND AND SETS THEM AS PROPS ON THE BACKGROUN THUMBNAIL
 const backgroundCollection = ref([]);
</script>

<template>
  <div class="h-screen w-screen bg-zinc-800">
    <div 
      v-for="(background, index) in backgroundCollection" 
      :key="`background-${index}`"
    >
      <BackgroundThumbnail :background="background" />
    </div>
  </div>
</template>
