<template>
  <!--
  ObraCard.vue

  Este componente se encarga de mostrar un resumen de la información de una obra musical dentro de la lista de repertorios.

  Funcionalidades principales:
  - Muestra los detalles básicos de la obra, incluyendo el título, compositor, grupo, dificultad y el rango de compases.
  - Integra el componente `ProgresoObra.vue` para visualizar el progreso de la obra mediante una cuadrícula de colores que indica el estado de los compases.
  - Incluye botones de acción para editar o eliminar la obra.

  Props:
  - obra: Un objeto que contiene toda la información relevante de la obra (título, compositor, grupo, dificultad, estado de los compases, etc.).

  Métodos clave:
  - editarObra: Emite un evento hacia el componente padre para indicar que se desea editar la obra.
  - eliminarObra: Emite un evento hacia el componente padre para indicar que se desea eliminar la obra.

  Este componente proporciona una forma clara y concisa de presentar cada obra en la lista, con accesos rápidos para modificar o eliminar la información según sea necesario.
  -->

  <q-item clickable>
    <q-item-section>
      <q-item-label class="text-h6">{{ obra.Titulo }}</q-item-label>
      <q-item-label caption>{{ obra.Compositor }}</q-item-label>
      <q-item-label caption>Grupo: {{ obra.Grupo }}</q-item-label>
      <q-item-label caption>Dificultad: {{ obra.Dificultad }}</q-item-label>
      <q-item-label caption
        >Compases: {{ obra.Compases.desde }} -
        {{ obra.Compases.hasta }}</q-item-label
      >

      <!-- Componente ProgresoObra para mostrar el progreso visual -->
      <ProgresoObra :estadoObra="obra.EstadoObra" />
    </q-item-section>

    <q-item-section side>
      <q-btn flat icon="edit" @click="editarObra" />
      <q-btn flat icon="delete" color="negative" @click="eliminarObra" />
    </q-item-section>
  </q-item>
</template>

<script setup>
// Importamos las props y el subcomponente ProgresoObra.vue
import ProgresoObra from "./ProgresoObra.vue";
import { defineProps, defineEmits } from "vue";

// Definición de las props que recibe el componente
const props = defineProps({
  obra: {
    type: Object,
    required: true,
  },
});

// Emisión de eventos al componente padre
const emit = defineEmits(["editar", "eliminar"]);

const editarObra = () => {
  emit("editar", props.obra);
};

const eliminarObra = () => {
  emit("eliminar", props.obra.id);
};
</script>

<style scoped>
.q-item {
  border-bottom: 1px solid #333;
}

.text-h6 {
  font-weight: bold;
  margin-bottom: 5px;
}

.caption {
  color: #999;
}
</style>
