<template>
  <q-layout view="hHh lpR fFf" class="">
    <q-header reveal class="fondo q-py-xs">
      <q-toolbar>
        <q-space />

        <div class="no-wrap">
          <q-btn flat no-wrap class="flex justify-center" @click="$router.push('/')">
            <img src="~assets/funeyca.png" style="width: 60px; height: 60px" />
          </q-btn>
        </div>

        <q-space />
      </q-toolbar>
    </q-header>

    <q-footer>
      <FooterBotones />
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// import { inject, ref } from "vue";
import { ref, reactive } from "vue";
import FooterBotones from "src/components/Footer-Botones.vue";
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);
const search = ref("");
const sesion = true;

// const sesion = inject("SESION");

const links2 = ref([
  {
    icon: "no_accounts",
    text: "Ver Lista de Inactivos",
    to: "/Lista_Inactivos",
  },
  {
    icon: "insights",
    text: "Gráficas de Asistencias",
    to: "/Registrar_Alumnos",
  },
  { icon: "speed", text: "Progreso del Alumno", to: "/Perfil_Alumnos" },
]);

const links3 = ref([
  { icon: "chart_simple", text: "YouTube Premium" },
  { icon: "local_movies", text: "Movies & Shows" },
  { icon: "videogame_asset", text: "Gaming" },
  { icon: "live_tv", text: "Live" },
]);

const buttons1 = ref([
  { text: "About" },
  { text: "Press" },
  { text: "Copyright" },
  { text: "Contact us" },
  { text: "Creators" },
  { text: "Advertise" },
  { text: "Developers" },
]);
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
