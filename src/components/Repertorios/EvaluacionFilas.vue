<template>
  <div class="evaluacion-filas">
    <q-item-label>Evaluación de Filas</q-item-label>

    <!-- Slider para la fila de cuerdas -->
    <q-slider
      v-model="localEvaluacion.cuerdas"
      label="Cuerdas"
      :min="1"
      :max="5"
      markers
      label-always
      color="primary"
      @update:model-value="emitChange('cuerdas', $event)"
    />

    <!-- Slider para la fila de viento madera -->
    <q-slider
      v-model="localEvaluacion.vientoMadera"
      label="Viento Madera"
      :min="1"
      :max="5"
      markers
      label-always
      color="primary"
      @update:model-value="emitChange('vientoMadera', $event)"
    />

    <!-- Slider para la fila de viento metal -->
    <q-sliders
      v-model="localEvaluacion.vientoMetal"
      label="Viento Metal"
      :min="1"
      :max="5"
      markers
      label-always
      color="primary"
      @update:model-value="emitChange('vientoMetal', $event)"
    />

    <!-- Slider para la fila de percusión -->
    <q-slider
      v-model="localEvaluacion.percusion"
      label="Percusión"
      :min="1"
      :max="5"
      markers
      label-always
      color="primary"
      @update:model-value="emitChange('percusion', $event)"
    />

    <!-- Otros sliders pueden añadirse aquí según sea necesario -->
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
// Definimos las props que el componente recibe
const props = defineProps({
  evaluacion: {
    type: Object,
    required: true,
  },
});

// Definimos una copia local de la prop evaluacion para poder manipularla dentro del componente
const localEvaluacion = ref({ ...props.evaluacion });

// Emitimos un evento al componente padre para notificarle del cambio en la evaluación
const emit = defineEmits(["update:evaluacion"]);

const emitChange = (fila, valor) => {
  localEvaluacion.value[fila] = valor;
  emit("update:evaluacion", { ...localEvaluacion.value });
};
</script>

<style scoped>
.evaluacion-filas {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Estilos adicionales para el componente */
</style>
