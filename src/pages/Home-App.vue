<script setup>
import { onMounted, ref, computed } from "vue";
import { getAlumnos, classificationByGroup } from "src/firebase";
import MenuSecundario from "src/components/Menu-Secundario.vue";
import ListadoHorizontal from "src/components/Listado-Horizontal.vue";
import AgruparPorGenero from "src/components/Poblacion-Genero.vue";
import PoblacionAlumnos from "src/components/Poblacion-Alumnos.vue";
import LapsoAsistencias from "src/components/LapsoAsistencias.vue";

const Alumnos = ref([]);
const Grupos = ref([]);
const loading = ref(true);

onMounted(async () => {
  Grupos.value = await classificationByGroup();
  Alumnos.value = await getAlumnos();
  loading.value = Alumnos.value.length === 0;
});
</script>

<template>
  <div v-if="loading" class="loading-container text-red-1">
    <div class="loading"></div>
  </div>
  <div v-else class="q-pa-md">
    <MenuSecundario />
    <div class="row justify-center">
      <div class="col-12 col-md-6 col-sm-12">
        <LapsoAsistencias />
      </div>
      <div class="col-12 col-md-6 col-sm-12">
        <div class="row justify-center">
          <AgruparPorGenero />
          <PoblacionAlumnos />
        </div>
      </div>
    </div>
    <main v-for="(grupo, index) in Grupos" :key="index">
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
