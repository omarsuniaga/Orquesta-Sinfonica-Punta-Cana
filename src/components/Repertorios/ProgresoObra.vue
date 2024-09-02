<template>
  <div class="progreso-obra">
    <!-- Iteramos sobre cada compás en el estadoObra -->
    <CompasStatus
      v-for="(compas, index) in estadoObra"
      :key="index"
      :estado="compas"
      :editable="editable"
      @cambiar-estado="actualizarEstadoCompas(index, $event)"
    />
  </div>
</template>

<script setup>
// Importamos el subcomponente CompasStatus.vue
import CompasStatus from "./CompasStatus.vue";

// Definimos las props que el componente recibe
const props = defineProps({
  estadoObra: {
    type: Array,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
});

// Emitimos un evento para actualizar el estado de la obra
const emit = defineEmits(["actualizar-estado-obra"]);

// Método para actualizar el estado de un compás
const actualizarEstadoCompas = (index, nuevoEstado) => {
  const nuevoEstadoObra = [...props.estadoObra];
  nuevoEstadoObra[index] = nuevoEstado;
  emit("actualizar-estado-obra", nuevoEstadoObra);
};
</script>

<style scoped>
.progreso-obra {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
</style>
