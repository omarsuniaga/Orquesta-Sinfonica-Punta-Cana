<template>
  <div class="q-ma-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Total de Alumnos</div>
        <div class="text-subtitle2">{{ totales }} Alumnos</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  totales: Number,
});
</script>
