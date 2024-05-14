<template>
  <div class="lista-asistencia">
    <div v-if="cargando">
      <q-spinner-cube color="indigo" />
    </div>
    <div v-else>
      <tarjeta-estudiante
        v-for="(item, index) in lista"
        :key="index"
        :item="item"
        @click="emit('clickItem', item)"
        @longPress="emit('longPressItem', item)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import TarjetaEstudiante from "./TarjetaEstudiante.vue";

const props = defineProps({
  cargando: Boolean,
  lista: Array,
});

const emit = defineEmits(["clickItem", "longPressItem"]);
</script>
