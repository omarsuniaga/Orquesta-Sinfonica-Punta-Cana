<template>
  <q-slide-item
    @left="onSwipeLeft"
    @right="onSwipeRight"
    @up="onSwipeUp"
    @down="onSwipeDown"
    :class="getItemClass"
  >
    <template v-slot:left>
      <q-icon name="alarm" color="orange" />
      <q-item-label>Demorado</q-item-label>
    </template>
    <template v-slot:right>
      <q-icon name="description" color="teal" />
      <q-item-label>Justificado</q-item-label>
    </template>
    <q-item>
      <q-item-section>
        <q-item-label class="text-weight-bold text-h6">{{
          alumno.nombre
        }}</q-item-label>
        <q-item-label caption>{{ alumno.apellido }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-slide-item>
</template>

<script setup>
import { computed } from "vue";
import { useAlumnoStore } from "../stores/alumnoStore";

const props = defineProps({
  alumno: Object,
});

const store = useAlumnoStore();

const getItemClass = computed(() => {
  if (store.demorados.includes(props.alumno.id)) return "bg-morado-claro";
  if (store.justificados.includes(props.alumno.id)) return "bg-naranja-claro";
  if (store.presentes.includes(props.alumno.id)) return "bg-verde-claro";
  return "bg-rojo-claro";
});

const onSwipeLeft = () => {
  if (store.demorados.includes(props.alumno.id)) {
    store.quitarEstadoDemorado(props.alumno.id);
  } else {
    store.marcarComoDemorado(props.alumno.id);
  }
};

const onSwipeRight = () => {
  if (store.justificados.includes(props.alumno.id)) {
    store.quitarEstadoJustificado(props.alumno.id);
  } else {
    store.marcarComoJustificado(props.alumno.id);
  }
};

const onSwipeUp = () => {
  store.marcarComoPresente(props.alumno.id);
};

const onSwipeDown = () => {
  store.marcarComoAusente(props.alumno.id);
};
</script>

<style scoped>
.bg-morado-claro {
  background-color: #d8b3ff;
}
.bg-naranja-claro {
  background-color: #ffcc99;
}
.bg-rojo-claro {
  background-color: #ffcccc;
}
.bg-verde-claro {
  background-color: #ccffcc;
}
</style>
