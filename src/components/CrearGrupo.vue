<template>
  <q-card class="q-ma-md q-pa-md" bordered>
    <q-input
      v-model="nuevoGrupo"
      label="Nombre del nuevo grupo"
      outlined
      dense
    />
    <q-btn @click="crearGrupo" label="Crear Grupo" color="primary" />
  </q-card>
</template>

<script setup>
import { ref } from "vue";
import { crearNuevoGrupo } from "../FirebaseService/database";

const nuevoGrupo = ref("");

const crearGrupo = async () => {
  if (nuevoGrupo.value) {
    await crearNuevoGrupo(nuevoGrupo.value);
    nuevoGrupo.value = "";
    // Actualizar la lista de grupos si es necesario
  }
};
</script>
