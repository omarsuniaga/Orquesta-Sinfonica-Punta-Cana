<template>
  <div v-if="!loading" class="loading-container">
    <div class="loading"></div>
  </div>
  <div v-else class="q-my-md row justify-center bg-white">
    <div class="col-12 col-md-6 col-sm-12">
      <HistorialAsistencias />
    </div>
    <div class="col-12 col-md-6 col-sm-12">
      <div class="flex justify-between items-center">
        <GenderCard />
        <GroupCard />
      </div>
    </div>

    <q-toolbar>
      <div class="myCards">
        <!-- total de alumnos -->
        <p class="text-center text-white">Total de alumnos: asd</p>
      </div>
    </q-toolbar>

    <div class="col-auto">
      <q-card class="q-ma-md q-pa-md" bordered> </q-card>
      <div class="row justify-center">
        <q-btn flat @click="Salir()" label="Cerrar Sesión" color="warning" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";
import HistorialAsistencias from "src/components/Historial-Asistencias.vue";
import GenderCard from "src/pages/GenderCard.vue";
import GroupCard from "../pages/GroupCard.vue";
const loading = ref(true);
const model = ref("7");
const options = [
  {
    label: "Últimos 7 días",
    value: "7",
  },
  {
    label: "Últimos 30 días",
    value: "30",
  },
  {
    label: "Últimos 90 días",
    value: "90",
  },
  {
    label: "Últimos 180 días",
    value: "180",
  },
  {
    label: "Últimos 365 días",
    value: "365",
  },
];
//Esta funcion intenta almacenar en un objeto a los alumnos fecha y asistencia
onMounted(async () => {});
//crear observador watch efectt
watchEffect(async () => {});
</script>
<style>
* {
  color: "white";
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
