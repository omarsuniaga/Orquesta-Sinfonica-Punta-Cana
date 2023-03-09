<script setup>
import CarruselImagenes from "src/components/Carrusel-imagenes.vue";
import MenuSecundario from "src/components/Menu-Secundario.vue";
import ListadoHorizontal from "src/components/Listado-Horizontal.vue";
import { onMounted, ref } from "vue";
import { getAlumnos, classificationByGroup, __NIVEL, auth } from "src/firebase";
import { useNivelStore } from "../stores/Niveles";
const store = useNivelStore();
const Alumnos = ref([]);
let group = ref([]);
let id = ref();
let loading = ref(false);
let nivel = ref("");

onMounted(async () => {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      nivel.value = await store.setNivel(user.email);
      nivel.value = parseInt(nivel.value);
    }
  });

  group.value = await (await classificationByGroup()).reverse();
  Alumnos.value = await getAlumnos();
  if (Alumnos.value !== 0) {
    return (loading.value = true);
  }
});
</script>

<template>
  <div v-if="!loading" class="loading-container text-red-1">
    {{ nivel }}
    <div class="loading"></div>
  </div>
  <div v-else class="q-py-sm">
    <CarruselImagenes />
    <MenuSecundario />
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
