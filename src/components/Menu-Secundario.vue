<template>
  <div class="q-pa-md q-gutter-sm flex justify-around">
    <br />
    <q-btn
      v-for="(item, i) in MenuSecundario"
      :key="i"
      dense
      :icon="item.icon"
      size="35px"
      round
      color="teal"
      @click="$router.push(item.to)"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
// importar router
import { useRouter } from "vue-router";
const $router = useRouter();
const MenuSecundario = ref([
  {
    icon: "ssid_chart",
    to: "/",
    value: "asistencia",
  },
  {
    icon: "event",
    to: "/Pasar_Asistencias",
    value: "eventos",
  },
  {
    icon: "diversity_1",
    to: "/Perfil_Alumnos/filter:All",
    value: "Perfil_Alumnos",
  },
]);
</script>
