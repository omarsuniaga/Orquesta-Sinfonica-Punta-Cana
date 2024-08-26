<template>
  <div class="col-auto" style="width: 85%">
    <q-input
      outlined
      bottom-slots
      color="primary"
      v-model.trim="text"
      label="Buscar Alumnos"
      bg-color="white"
      dense
      @keyup.enter="emitBuscar"
    >
      <template v-slot:append>
        <q-icon
          v-if="text !== ''"
          name="close"
          @click="resetear"
          class="cursor-pointer"
        />
        <q-icon name="search" @click="emitBuscar" />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { buscarAlumnoPorNombre } from "../FirebaseService/database";

// Definir las propiedades y los eventos emitidos
const text = ref("");
const res = ref([]);
const emit = defineEmits(["onFire"]);

// Función para emitir los resultados de la búsqueda
const emitBuscar = () => {
  emit("onFire", res.value);
};

// Función para resetear el campo de búsqueda
const resetear = () => {
  text.value = "";
  res.value = [];
  emitBuscar();
};

// Función para buscar alumnos
const buscar = async () => {
  res.value = await buscarAlumnoPorNombre(text.value.toLowerCase());
  emitBuscar();
};

// Usar `watch` para observar cambios en `text` y activar la búsqueda
watch(text, async (newValue) => {
  if (newValue.length > 0) {
    await buscar();
  } else {
    res.value = [];
    emitBuscar(); // Emitir resultados vacíos si el texto está vacío
  }
});
</script>
