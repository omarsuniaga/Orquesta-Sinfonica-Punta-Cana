<template>
  <div style="min-width: 360px; width: 100%">
    <q-btn-toggle
      spread
      v-model="model"
      class="my-custom-toggle"
      toggle-color="grey-6"
      color="white"
      no-caps
      stretch
      unelevated
      text-color="grey-9"
      :options="Botones"
      padding="10px"
    >
    </q-btn-toggle>
  </div>
</template>

<script setup>
import { ref } from "vue";
let model = ref("home");
const Botones = ref([
  {
    icon: "home",
    to: "/",
    value: "home",
  },
  {
    icon: "rule",
    to: "/Nuevo-Alumno",
    value: "Registrar",
  },
  {
    icon: "search",
    to: "/Buscar",
    value: "buscar",
  },
  {
    icon: "dashboard",
    to: "/Dashboard",
    value: "dashboard",
  },
]);
</script>
<style lang="sass" scoped>
.my-custom-toggle
  width: 100%
  background-color: white
</style>
