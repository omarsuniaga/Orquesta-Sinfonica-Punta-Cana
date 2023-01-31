<template>
  <q-layout view="hHh lpR fFf" class="">
    <q-header reveal class="fondo q-py-xs">
      <div class="no-wrap">
        <q-btn flat no-wrap class="flex justify-center" to="/home">
          <img src="~assets/funeyca.png" style="width: 60px; height: 60px" />
        </q-btn>
      </div>
    </q-header>

    <q-footer>
      <div style="min-width: 360px; width: 100%">
        <q-btn-toggle
          spread
          v-model="model"
          toggle-color="grey-6"
          color="white"
          no-caps
          stretch
          unelevated
          text-color="grey-9"
          :options="Botones"
          padding="10px"
        >
        </q-btn-toggle>
      </div>
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
const $route = useRouter();
let model = ref($route.currentRoute._rawValue);
const Botones = ref([
  {
    icon: "home",
    to: "/Home",
    value: "home",
  },
  {
    icon: "rule",
    to: "/Nuevo-Alumno",
    value: "Nuevo-Alumno",
  },
  {
    icon: "search",
    to: "/Buscar",
    value: "buscar",
  },
  {
    icon: "dashboard",
    to: "/Dashboard",
    value: "dashboard",
  },
]);

watchEffect(() => {
  model.value ??= "home";
});
</script>

<style>
.fondo {
  background: #0f0c29; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #1b1b29,
    #134255,
    #1b1b29
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #1b1b29,
    #134255,
    #1b1b29
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
