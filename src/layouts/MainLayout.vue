<template>
  <q-layout view="hHh lpR fFf" class="">
    <q-header reveal class="fondo q-py-xs">
      <q-toolbar>
        <q-space />

        <div class="no-wrap">
          <q-btn flat no-wrap class="flex justify-center" @click="$router.push('/Home')">
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
import { ref } from "vue";
import FooterBotones from "src/components/Footer-Botones.vue";

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
