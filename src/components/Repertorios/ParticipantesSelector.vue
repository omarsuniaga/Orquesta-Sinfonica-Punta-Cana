<template>
  <div class="participantes-selector">
    <q-select
      v-model="localParticipantes"
      :options="alumnosFiltrados"
      label="Seleccionar Participantes"
      outlined
      dense
      multiple
      @update:model-value="actualizarParticipantes"
    />
  </div>
</template>

<script setup>
// Importamos las props y definimos los datos y métodos necesarios
import { ref, computed, defineProps, defineEmits } from "vue";

// Props recibidas desde el componente padre
const props = defineProps({
  grupo: {
    type: String,
    required: true,
  },
  participantes: {
    type: Array,
    required: true,
  },
});

// Datos iniciales
const localParticipantes = ref([...props.participantes]);

// Ejemplo de alumnos en el sistema (en una implementación real, esto vendría de un store o una API)
const alumnos = ref([
  { id: 1, nombre: "Juan Pérez", grupo: "Orquesta" },
  { id: 2, nombre: "María García", grupo: "Coro" },
  { id: 3, nombre: "Pedro Sánchez", grupo: "Orquesta" },
  { id: 4, nombre: "Ana López", grupo: "Ensamble" },
  // Añadir más alumnos según sea necesario
]);

// Computed para filtrar los alumnos según el grupo seleccionado
const alumnosFiltrados = computed(() => {
  return alumnos.value
    .filter((alumno) => alumno.grupo === props.grupo) // Cambiado a props.grupo
    .map((alumno) => ({
      label: alumno.nombre,
      value: alumno.id,
    }));
});

// Emitimos un evento al componente padre cuando cambian los participantes seleccionados
const emit = defineEmits(["update:participantes"]);

const actualizarParticipantes = () => {
  emit("update:participantes", [...localParticipantes.value]);
};
</script>

<style scoped>
.participantes-selector {
  margin-top: 10px;
}

/* Estilos adicionales para el selector */
</style>
