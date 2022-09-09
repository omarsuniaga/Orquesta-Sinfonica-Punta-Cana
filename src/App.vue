<template>
  <router-view />
</template>

<script setup>
import { reactive, provide } from "vue";

const Resultado_Busqueda = reactive([]);
provide("Resultado_Busqueda", Resultado_Busqueda);
// const __SESION = reactive(false);
// const __USER = reactive({});
// provide("SESION", __SESION);
// provide("USER", __USER);
// console.log(__SESION);
</script>
