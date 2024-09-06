<template>
  <q-expansion-item
    icon="mdi-note-edit-outline"
    label="Registrar Notas"
    expand-separator
    header-class="bg-primary text-white"
  >
    <q-form @submit="submitNotas">
      <q-input
        v-model="notas"
        filled
        type="textarea"
        label="Notas del alumno"
        hint="Escribe las observaciones del progreso"
        maxlength="300"
        counter
        class="q-mb-md"
      />

      <q-input
        v-model="fecha"
        filled
        label="Fecha de Evaluación"
        mask="YYYY-MM-DD"
        class="q-mb-md"
      />

      <q-input
        v-model="comentarios"
        filled
        type="textarea"
        label="Comentarios adicionales"
        hint="Añade comentarios sobre el rendimiento del alumno"
        maxlength="300"
        counter
        class="q-mb-md"
      />

      <q-btn
        label="Guardar Notas"
        type="submit"
        color="primary"
        class="full-width q-mb-md"
      />
    </q-form>
  </q-expansion-item>
</template>

<script setup>
import { ref } from "vue";

// Variables reactivas para almacenar las notas, fecha, y comentarios
const notas = ref("");
const fecha = ref(new Date().toISOString().slice(0, 10)); // Fecha actual por defecto
const comentarios = ref("");

// Función que maneja el envío del formulario de notas
const submitNotas = () => {
  const evaluacion = {
    notas: notas.value,
    fecha: fecha.value,
    comentarios: comentarios.value,
  };

  // Emitimos el evento al componente padre con los datos de la evaluación
  emit("guardarNotas", evaluacion);

  // Limpiamos los campos después de guardar
  notas.value = "";
  comentarios.value = "";
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
