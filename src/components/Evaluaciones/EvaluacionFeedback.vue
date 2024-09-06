<template>
  <q-card-section>
    <q-form @submit.prevent="guardarFeedback">
      <div class="q-mb-md">
        <q-input
          v-model="feedback"
          filled
          type="textarea"
          label="Comentarios sobre el progreso del alumno"
          hint="Escribe tus observaciones sobre el rendimiento"
          maxlength="300"
          counter
        />
      </div>
      <q-btn
        label="Guardar Feedback"
        color="primary"
        type="submit"
        class="full-width"
      />
    </q-form>
  </q-card-section>
</template>

<script setup>
import { ref } from "vue";

// Definimos el feedback como un campo reactivo
const feedback = ref("");

// Función que maneja el guardado del feedback
const guardarFeedback = () => {
  console.log("Feedback guardado:", feedback.value);
  // Aquí puedes agregar la lógica para enviar el feedback a Firebase o realizar cualquier otra acción
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
