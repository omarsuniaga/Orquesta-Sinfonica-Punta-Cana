<template>
  <div class="q-ma-md">
    <q-card class="my-card">
      <q-card-section class="">
        <div class="text-h6">Poblacion de Alumnos</div>
        <div class="text-subtitle2">
          <span>Total Alumnos: </span>
          {{ alumnos.length }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAlumnos } from "../firebase";
let alumnos = ref([]);
onMounted(() => {
  getAlumnos().then((res) => {
    return (alumnos.value = res);
  });
});
</script>
