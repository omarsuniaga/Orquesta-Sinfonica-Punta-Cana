<template>
  <q-layout view="hHh lpR fFf" class="">
    <q-header reveal class="fondo q-py-xs">
      <div class="no-wrap">
        <q-btn flat no-wrap class="flex justify-center" to="/">
          <img src="~assets/funeyca.png" style="width: 60px; height: 60px" />
        </q-btn>
      </div>
    </q-header>

    <q-footer>
      <div style="min-width: 350px; width: 100%">
        <q-btn-toggle
          spread
          v-model="model"
          toggle-color="green-6"
          color="white"
          no-caps
          stretch
          unelevated
          text-color="green-9"
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
import { auth } from "../firebase";
const $route = useRouter();
let model = ref($route.currentRoute._rawValue);
let Botones = ref([
  {
    icon: "home",
    to: "/",
    value: "",
    auth: auth.currentUser.displayName >= 0 ? true : false,
  },
  // {
  //   icon: "rule",
  //   to: "/Nuevo-Alumno",
  //   value: "Nuevo-Alumno",
  //   auth:
  //     auth.currentUser.displayName === 0
  //       ? true
  //       : auth.currentUser.displayName === 1
  //       ? true
  //       : false,
  // },
  {
    icon: "group",
    to: "/Asistencia",
    value: "Asistencia",
    auth: auth.currentUser.displayName >= 0,
  },
  {
    icon: "dashboard",
    to: "/Dashboard",
    value: "dashboard",
    auth: auth.currentUser.displayName >= 0,
  },
]);
Botones = Botones.value.filter((elem) => elem.auth === true);
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
