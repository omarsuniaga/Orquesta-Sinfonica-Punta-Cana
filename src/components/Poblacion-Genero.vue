<template>
  <div class="q-ma-md">
    <q-card class="my-card">
      <q-card-section class="">
        <div class="text-h6">Poblacion de generos</div>
        <div class="text-subtitle2">
          <q-img src="../../src/assets/chica.png" :ratio="1" width="30px" />
          {{ hembras }}
          <q-img src="../../src/assets/chico.png" :ratio="1" width="30px" />
          {{ varones }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  varones: Number,
  hembras: Number,
});
</script>
