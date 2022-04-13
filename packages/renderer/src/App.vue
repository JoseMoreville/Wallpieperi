<script lang="ts" setup>
/*
Obten el nombre del fondo seleccionado y  luego asignalo a la propiedad background de la clase App mediante una llamada al ipc de electron
Si el usuario cambia de fondo entonces el main de electron debe actualizar el fondo de la aplicacion
si el usuario sube se agrega un nuevo fondo a la lista de fondos
la mayoria de los datos como favoritos, fondo seleccionado se guardan en el electron store
*/

</script>

<template>
  <img
    src="../assets/logo.svg"
  >
</template>

<style>
  img {
    width: 100%;
    height: 100%;
  }
</style>
