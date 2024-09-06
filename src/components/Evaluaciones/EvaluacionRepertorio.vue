<template>
  <q-expansion-item
    icon="mdi-music-note"
    label="Registrar Repertorio"
    expand-separator
    header-class="bg-purple text-white"
  >
    <q-form @submit="submitRepertorio">
      <!-- Seleccionar si es repertorio colectivo o individual -->
      <q-select
        v-model="tipoRepertorio"
        :options="tipoRepertorioOptions"
        label="Tipo de Repertorio"
        filled
        class="q-mb-md"
        @update:model-value="onTipoRepertorioChange"
      />

      <!-- Campos para repertorio colectivo -->
      <div v-if="tipoRepertorio === 'colectivo'">
        <q-select
          v-model="repertorioColectivo"
          :options="repertorioColectivoOptions"
          label="Selecciona una obra del repertorio colectivo"
          filled
          class="q-mb-md"
        />
      </div>

      <!-- Campos para repertorio individual -->
      <div v-if="tipoRepertorio === 'individual'">
        <q-input
          v-model="tituloObra"
          filled
          label="Título de la Obra"
          class="q-mb-md"
        />
        <q-input
          v-model="compositor"
          filled
          label="Compositor"
          class="q-mb-md"
        />
        <q-input
          v-model="numCompases"
          filled
          label="Número de Compases"
          type="number"
          class="q-mb-md"
        />

        <!-- Estados de los compases (puedes personalizar esto con más detalles) -->
        <q-select
          v-model="estadoCompases"
          :options="estadoCompasesOptions"
          label="Estado de los compases"
          filled
          class="q-mb-md"
        />
      </div>

      <!-- Fecha de evaluación -->
      <q-input
        v-model="fechaEvaluacion"
        filled
        label="Fecha de Evaluación"
        mask="YYYY-MM-DD"
        class="q-mb-md"
      />

      <!-- Comentarios adicionales -->
      <q-input
        v-model="comentarios"
        filled
        type="textarea"
        label="Comentarios adicionales"
        hint="Observaciones sobre el progreso"
        maxlength="300"
        counter
        class="q-mb-md"
      />

      <q-btn
        label="Guardar Repertorio"
        type="submit"
        color="primary"
        class="full-width q-mb-md"
      />
    </q-form>
  </q-expansion-item>
</template>

<script setup>
import { ref } from "vue";

// Variables para el tipo de repertorio
const tipoRepertorio = ref("");
const tipoRepertorioOptions = ref(["colectivo", "individual"]);

// Variables para el repertorio colectivo
const repertorioColectivo = ref("");
const repertorioColectivoOptions = ref([
  "Concierto en Sol Mayor",
  "Sinfonía No. 5",
  "Suite en Re",
]);

// Variables para el repertorio individual
const tituloObra = ref("");
const compositor = ref("");
const numCompases = ref(0);
const estadoCompases = ref("");
const estadoCompasesOptions = ref([
  "Estudiado",
  "Por estudiar",
  "Parcialmente estudiado",
]);

// Variables comunes
const fechaEvaluacion = ref(new Date().toISOString().slice(0, 10));
const comentarios = ref("");

// Función que maneja el envío del formulario
const submitRepertorio = () => {
  const repertorio = {
    tipo: tipoRepertorio.value,
    repertorioColectivo: repertorioColectivo.value,
    tituloObra: tituloObra.value,
    compositor: compositor.value,
    numCompases: numCompases.value,
    estadoCompases: estadoCompases.value,
    fechaEvaluacion: fechaEvaluacion.value,
    comentarios: comentarios.value,
  };

  // Emitimos el evento al componente padre con los datos del repertorio
  emit("guardarRepertorio", repertorio);

  // Limpiar los campos después de guardar
  tituloObra.value = "";
  compositor.value = "";
  numCompases.value = 0;
  estadoCompases.value = "";
  comentarios.value = "";
};

// Función que actualiza los campos según el tipo de repertorio
const onTipoRepertorioChange = (newTipo) => {
  if (newTipo === "colectivo") {
    // Limpiar campos de repertorio individual si se cambia a colectivo
    tituloObra.value = "";
    compositor.value = "";
    numCompases.value = 0;
    estadoCompases.value = "";
  } else if (newTipo === "individual") {
    // Limpiar el repertorio colectivo si se cambia a individual
    repertorioColectivo.value = "";
  }
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
