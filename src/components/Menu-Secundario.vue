<template>
  <div class="q-pa-sm q-gutter-xs flex justify-around">
    <div v-for="item in MenuSecundario" :key="item.value" class="q-mb-md">
      <q-btn
        dense
        :icon="item.icon"
        size="25px"
        round
        color="teal"
        @click="$router.push(item.to)"
        stack
        glossy
      />
      <q-tooltip>{{ item.value }}</q-tooltip>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const $router = useRouter();

const MenuSecundario = ref([
  {
    icon: "ssid_chart",
    to: "/Asistencia",
    value: "Asistencia",
  },
  {
    icon: "people",
    to: "/Nuevo-Alumno",
    value: "Nuevo Alumno",
  },
  {
<<<<<<< HEAD
    icon: "search",
    to: "/instruments",
    value: "InstrumentsDetails",
=======
    icon: "diversity_1",
    to: "/Buscar",
    value: "Buscar",
>>>>>>> 3c50e3bba4af11843f054e40fcc9065212137fb0
  },
]);
</script>
