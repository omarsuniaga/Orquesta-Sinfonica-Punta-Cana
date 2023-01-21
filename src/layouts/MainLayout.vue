<template>
  <q-layout view="hHh lpR fFf" class="fondo">
    <q-header elevated reveal class="bg-dark q-py-xs">
      <q-toolbar>
        <q-space />

        <div class="no-wrap bg-dark">
          <q-btn flat no-wrap class="flex justify-center" @click="$router.push('/')">
            <img
              src="~assets/favicon-96x96-orquesta.jpg"
              style="width: 60px; height: 60px"
            />
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

import { fabYoutube } from "@quasar/extras/fontawesome-v6";
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

<style lang="sass">
.fondo
  background-color: #262a3a
  border-radius: 5px
  box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.5), 0px 5px 5px rgba(0, 0, 0, 0.5)
</style>
