<template>
  <div class="q-pa-sm">
    <q-btn
      color="warning"
      text-color="black"
      label="Registra tu clase"
      @click="eleccion()"
    />
  </div>
</template>

<script setup>
// importar router
import { useRouter } from "vue-router";
const router = useRouter();
const eleccion = () => {
  console.log("Hola");
  router.push("/ClasesGrupos");
};
</script>
