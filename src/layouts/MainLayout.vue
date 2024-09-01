<template>
  <q-layout view="hHh lpR fFf" class="">
    <!-- Header -->
    <q-header reveal class="fondo">
      <div class="no-wrap">
        <q-btn flat no-wrap class="flex justify-center" to="/" @click="goBack">
          <img src="~assets/funeyca.png" style="width: 50px; height: 50px" />
        </q-btn>
      </div>
    </q-header>

    <!-- Footer -->
    <q-footer>
      <div class="footer-container">
        <q-btn-toggle
          spread
          v-model="model"
          toggle-color="green-6"
          color="white"
          no-caps
          unelevated
          text-color="green-9"
          :options="filteredBotones"
          @click="onButtonClick"
        />
      </div>
    </q-footer>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { auth } from "../firebase";

const router = useRouter();
const model = ref(router.currentRoute.value.path); // Inicializa con la ruta actual

// Definición de botones con rutas exactas
const Botones = ref([
  {
    icon: "home",
    to: "/",
    value: "/",
    auth: auth.currentUser?.displayName >= 0,
  },
  {
    icon: "group",
    to: "/Asistencia",
    value: "/Asistencia",
    auth: auth.currentUser?.displayName >= 0,
  },
  {
    icon: "dashboard",
    to: "/Dashboard",
    value: "/Dashboard",
    auth: auth.currentUser?.displayName >= 0,
  },
]);

// Filtra y marca los botones activos según la ruta actual
const filteredBotones = computed(() => {
  return Botones.value
    .filter((elem) => elem.auth) // Filtra según autenticación
    .map((elem) => ({
      ...elem,
      active: elem.to === model.value, // Compara ruta exacta para activar botón
    }));
});

// Monitorea cambios en la ruta y actualiza el botón activo
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    model.value = newPath;
    filteredBotones.value.forEach((elem) => {
      elem.active = elem.to === newPath;
    });
  }
);

// Función para manejar clics en los botones del footer
const onButtonClick = (to) => {
  model.value = to;
};

const goBack = () => {
  router.go(-1);
};
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

.footer-container {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  box-sizing: border-box;
}

.q-footer {
  margin-top: 10px;
}
</style>
