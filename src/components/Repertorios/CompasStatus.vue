<template>
  <div class="compas-status" :class="colorCompas" @click="cambiarEstado"></div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  estadoInicial: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["cambio"]);

const estadoCompas = ref(props.estadoInicial);

const colorCompas = computed(() => {
  switch (estadoCompas.value) {
    case 1:
      return "compas-rojo";
    case 2:
      return "compas-naranja";
    case 3:
      return "compas-verde";
    default:
      return "";
  }
});

const cambiarEstado = () => {
  estadoCompas.value = (estadoCompas.value % 3) + 1;
  emit("cambio", estadoCompas.value);
};
</script>

<style scoped>
.compas-status {
  width: 40px;
  height: 40px;
  border-radius: 30px;
  margin: 2px;
  cursor: pointer;
}

.compas-rojo {
  background-color: red;
}

.compas-naranja {
  background-color: orange;
}

.compas-verde {
  background-color: green;
}
</style>
