<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">
        {{ obra.id ? "Editar Repertorio" : "Nuevo Repertorio" }}
      </div>
    </q-card-section>

    <q-card-section>
      <q-input
        v-model="localObra.Titulo"
        label="Título"
        outlined
        dense
        class="q-mb-sm"
      />
      <q-input
        v-model="localObra.Compositor"
        label="Compositor"
        outlined
        dense
        class="q-mb-sm"
      />
      <q-select
        v-model="localObra.Grupo"
        :options="grupos"
        label="Grupo"
        outlined
        dense
        class="q-mb-sm"
      />
      <q-input
        v-model="localObra.Compases.desde"
        label="Compás Desde"
        type="number"
        outlined
        dense
        class="q-mb-sm"
      />
      <q-input
        v-model="localObra.Compases.hasta"
        label="Compás Hasta"
        type="number"
        outlined
        dense
        class="q-mb-sm"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat label="Cancelar" color="primary" @click="$emit('cancelar')" />
      <q-btn flat label="Guardar" color="primary" @click="guardarObra" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, watchEffect, defineProps } from "vue";

// Props recibidas desde el componente padre
const props = defineProps({
  obra: {
    type: Object,
    required: true,
  },
  grupos: {
    type: Array,
    required: true,
  },
});

const localObra = ref({ ...props.obra });

watchEffect(() => {
  localObra.value = { ...props.obra };
});

const guardarObra = () => {
  $emit("guardar", localObra.value);
};
</script>

<style scoped>
.q-mb-sm {
  margin-bottom: 16px;
}
</style>
