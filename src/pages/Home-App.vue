<template>
  <div v-if="loading" class="loading-container">
    <div class="loading"></div>
  </div>
  <div v-else class="q-pa-md">
    <MenuSecundario />
    <div class="row justify-center q-ma-md">
      <div class="col-12 col-md-12 q-pa-md">
        <LapsoAsistencias />
      </div>
      <div class="col-12 col-md-6 q-pa-md">
        <div class="row justify-around items-center">
          <AgruparPorGenero
            :varones="data.masculinos"
            :hembras="data.femeninos"
            class="q-ma-md"
          />
          <PoblacionAlumnos :totales="totalAlumnos" class="q-ma-md" />
        </div>
      </div>
    </div>
    <div class="main-content">
      <h2 class="text-center text-primary q-mb-md">Grupos</h2>
      <div v-for="(grupo, index) in Grupos" :key="index" class="">
        <ListadoHorizontal :grupo="grupo" :Alumnos="Alumnos" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  conteoGeneros,
  classificationByGroup,
  obtenerAlumnos,
} from "../FirebaseService/database";
import MenuSecundario from "src/components/Menu-Secundario.vue";
import ListadoHorizontal from "src/components/Listado-Horizontal.vue";
import AgruparPorGenero from "src/components/Poblacion-Genero.vue";
import PoblacionAlumnos from "src/components/Poblacion-Alumnos.vue";
import LapsoAsistencias from "src/components/LapsoAsistencias.vue";
import { useRouter } from "vue-router";

const data = ref({ masculinos: 0, femeninos: 0 });
const Alumnos = ref([]);
const Grupos = ref([]);
const loading = ref(true);
const totalAlumnos = ref(0);
const router = useRouter();
const irACatedras = () => {
  router.push({ name: "Catedras" });
};

onMounted(async () => {
  Grupos.value = await classificationByGroup();
  Alumnos.value = await obtenerAlumnos();
  data.value = await conteoGeneros();
  totalAlumnos.value = data.value.masculinos + data.value.femeninos;
  loading.value = false; // Asegúrate de que el estado de carga cambie al final
});
</script>

<style>
.main-content {
  background-color: #2e405c; /* Color de fondo suave */
  border-radius: 35px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  overflow-y: hidden;
}

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

.loading {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.text-primary {
  color: #2c3e50; /* Color primario */
}

.q-ma-md {
  margin: 1px; /* Margen uniforme para mejorar el espaciado */
}
</style>
