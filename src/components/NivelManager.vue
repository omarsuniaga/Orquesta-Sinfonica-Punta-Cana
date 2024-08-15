<template>
  <div>
    <div class="nivel-container">
      <q-input
        v-model="nuevoNivel"
        placeholder="Agregar nuevo nivel"
        clearable
        @keyup.enter="agregarNivel"
      />
      <q-btn @click="agregarNivel" label="Agregar Nivel" color="primary" />
    </div>

    <div class="niveles-list">
      <div v-for="(nivel, index) in niveles" :key="index" class="nivel-item">
        <q-input v-model="niveles[index]" />
        <q-btn
          @click="eliminarNivel(index)"
          label="Eliminar"
          color="negative"
        />
      </div>
    </div>

    <div class="acciones">
      <q-btn @click="guardarNiveles" label="Guardar Cambios" color="positive" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  cargarNiveles,
  guardarNivelesEnFirebase,
} from "../FirebaseService/database";

const nuevoNivel = ref("");
const niveles = ref([]);

// Cargar los niveles al montar el componente
onMounted(async () => {
  const data = await cargarNiveles();
  niveles.value = data || [];
});

// Función para agregar un nuevo nivel a la lista
const agregarNivel = () => {
  if (nuevoNivel.value.trim() !== "") {
    niveles.value.push(nuevoNivel.value.trim());
    nuevoNivel.value = ""; // Limpiar el campo de texto
  }
};

// Función para eliminar un nivel de la lista
const eliminarNivel = (index) => {
  niveles.value.splice(index, 1);
};

// Función para guardar los niveles en Firebase
const guardarNiveles = async () => {
  try {
    await guardarNivelesEnFirebase(niveles.value);
    alert("Niveles guardados exitosamente");
  } catch (error) {
    console.error("Error al guardar los niveles: ", error);
    alert("Hubo un error al guardar los niveles");
  }
};
</script>

<style scoped>
.nivel-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.niveles-list {
  margin-bottom: 20px;
}

.nivel-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.acciones {
  text-align: right;
}
</style>
