<script setup>
import { onMounted, ref, computed } from "vue";
import { getAlumnos, classificationByGroup, __NIVEL, auth } from "src/firebase";
import { useNivelStore } from "../stores/Niveles";
import useAuthState from "./useAuthState"; // Mover la lógica de autenticación a un compositor

import CarruselImagenes from "src/components/Carrusel-imagenes.vue";
import MenuSecundario from "src/components/Menu-Secundario.vue";
import ListadoHorizontal from "src/components/Listado-Horizontal.vue";
import AgruparPorGenero from "src/components/Poblacion-Genero.vue";
import PoblacionAlumnos from "src/components/Poblacion-Alumnos.vue";
import LapsoAsistencias from "src/components/LapsoAsistencias.vue";

const store = useNivelStore();
const Alumnos = ref([]);
const group = ref([]); // Cambiar a const
const id = ref();
const loading = ref(false);
const nivel = ref("");
const mensaje = ref("Carrusel");

const { user, error, isAuthenticated } = useAuthState(); // Usar el compositor de autenticación

onMounted(async () => {
  nivel.value = await auth.currentUser.phoneNumber;
  group.value = await classificationByGroup();
  Alumnos.value = await getAlumnos();
  if (Alumnos.value !== 0) {
    return (loading.value = true);
  }
});
</script>

<!-- Resto del componente... -->

<template>
  <div v-if="!loading" class="loading-container text-red-1">
    {{ nivel }}
    <div class="loading"></div>
  </div>
  <div v-else class="q-pa-md">
    <MenuSecundario />
    <div class="row justify-center">
      <!-- System column -->
      <div class="col-12 col-md-6 col-sm-12">
        <LapsoAsistencias />
        <!-- <CarruselImagenes :mensaje="mensaje" /> -->
      </div>
      <div class="col-12 col-md-6 col-sm-12">
        <div class="row justify-center">
          <AgruparPorGenero />
          <PoblacionAlumnos />
        </div>
      </div>
    </div>

    <!-- if screen xl -->
    <main v-for="(grupo, index) in group" :key="index">
      <ListadoHorizontal :grupo="grupo" :Alumnos="Alumnos" />
    </main>
  </div>
</template>
<style>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* Define la animación de carga */
.loading-container .loading {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

/* Define la keyframe de la animación */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
