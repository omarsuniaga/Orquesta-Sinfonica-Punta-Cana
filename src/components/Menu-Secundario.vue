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
    icon: "user",
    to: "/Nuevo-Alumno",
    value: "Eventos",
  },
  {
    icon: "diversity_1",
    to: "/Buscar",
    value: "Buscar",
  },
]);
</script>
