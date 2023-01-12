<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8 q-py-xs" height-hint="58">
      <q-toolbar class="">
        <q-space />

        <div class="no-wrap">
          <q-btn
            flat
            no-wrap
            class="flex justify-center"
            @click="$router.push('/')"
          >
            <img
              src="~assets/favicon-96x96-orquesta.jpg"
              style="width: 60px; height: 60px"
            />
            <q-toolbar-title shrink class="text-weight-bold row">
              SINFONICA JUVENIL
            </q-toolbar-title>
            <span class="text-overline self-end">PC</span>
          </q-btn>
        </div>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-8" icon="language">
            <q-tooltip>Ingles</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-8" icon="volunteer_activism">
            <q-tooltip>Donar</q-tooltip>
          </q-btn>
          <q-btn v-if="sesion" to="/" @click="Salir()" round flat>
            <q-avatar size="26px" icon="input"> </q-avatar>
            <q-tooltip> Iniciar Sesion </q-tooltip>
          </q-btn>
          <q-btn v-else round flat to="/Login">
            <q-avatar size="26px" icon="login"> </q-avatar>
            <q-tooltip> Entrar </q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-footer
      reveal
      elevated
      class="bg-white flex justify-around"
      style="min-width: 360px; width: 100%"
    >
      <!-- <q-btn
        flat
        round
        dense
        icon="menu"
        aria-label="Menu"
        @click="toggleLeftDrawer"
      /> -->
      <q-item v-for="link in links1" :key="link.text" :to="link.to">
        <q-btn flat :icon="link.icon" color="primary" :aria-label="link.text">
        </q-btn>
      </q-item>
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
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);
const search = ref("");
const sesion = true;

// const sesion = inject("SESION");
const links1 = ref([
  {
    icon: "fact_check",
    text: "Ver Lista de Inactivos",
    to: "/Pasar_Asistencias",
  },
  { icon: "person_add", text: "Registrar Alumnos", to: "/Registrar_Alumnos" },
  {
    icon: "view_list",
    text: "Perfil de Alumnos",
    to: "/Perfil_Alumnos/filter:All",
  },
]);

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
.YL
  &__toolbar-input-container
    min-width: 100px
    width: 55%
  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%
  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem
    &:hover
      color: #000
</style>
