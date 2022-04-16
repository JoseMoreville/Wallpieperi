<script lang="ts" setup>
/*
Obten el nombre del fondo seleccionado y  luego asignalo a la propiedad background de la clase App mediante una llamada al ipc de electron
Si el usuario cambia de fondo entonces el main de electron debe actualizar el fondo de la aplicacion
si el usuario sube se agrega un nuevo fondo a la lista de fondos
la mayoria de los datos como favoritos, fondo seleccionado se guardan en el electron store
*/
/* eslint-disable no-unused-vars */
import { ref, onMounted, provide } from "vue";
import BackgroundUploader from "./views/BackgroundUploader.vue";
import store from "./store/store";

const bg = ref('""');
const video = ref(null);
let extension = ref("");
const isMainRoute = ref(false);
provide<typeof store>('store',store);

if (!window.location.href.includes("uploader")) {
  isMainRoute.value = true;
}

onMounted(() => {
  if (!window.location.href.includes("uploader")) {
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
  <div v-if="isMainRoute">
    <video
      v-if="extension === 'mp4' || extension === 'webm'"
      ref="video"
      autoplay
      loop="true"
      muted="true"
      :type=" extension === 'webm' ? 'video/webm' : 'video/mp4'"
      :src="store.state.currentBackground"
      class="bg-video"
    />
    <img 
      v-if="extension === 'jpg' || extension === 'png'"
      :src="bg"
      class="bg-image"
    >
  </div>
  <BackgroundUploader v-else />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}
.bg-video {
  background-color: black;
  margin: 0 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  object-fit: cover;
}
</style>
