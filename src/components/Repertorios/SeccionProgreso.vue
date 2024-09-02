<template>
  <div>
    <div
      v-for="(estado, index) in estadosCompases"
      :key="index"
      class="compas-status"
      :class="colorCompas(estado)"
      @click="toggleEstado(index)"
    >
      {{ index + 1 }}
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";

// Recibir las props del componente padre
const props = defineProps({
  seccion: {
    type: String,
    required: true,
  },
  compases: {
    type: Number,
    required: true,
  },
  estadosIniciales: {
    type: Array,
    default: () => [],
  },
});

// Emisor de eventos para notificar al componente padre
const emit = defineEmits(["actualizar", "promedio"]);

// Variable reactiva para almacenar los estados de los compases
const estadosCompases = ref([]);

// Inicializar los compases con los estados iniciales o con 1
onMounted(() => {
  inicializarCompases();
});

// Función para inicializar los compases
const inicializarCompases = () => {
  estadosCompases.value =
    props.estadosIniciales.length > 0
      ? [...props.estadosIniciales]
      : Array(props.compases).fill(1);

  // Emitir el promedio inicial
  calcularYEmitirPromedio();
};

// Función para cambiar el estado de un compás
const toggleEstado = (index) => {
  if (typeof estadosCompases.value[index] !== "undefined") {
    estadosCompases.value[index] = (estadosCompases.value[index] % 3) + 1;
    emit("actualizar", {
      seccion: props.seccion,
      estadosCompases: estadosCompases.value,
    });
    // Recalcular y emitir el promedio después de actualizar el estado
    calcularYEmitirPromedio();
  }
};

// Función para devolver la clase CSS en función del estado
const colorCompas = (estado) => {
  switch (estado) {
    case 1:
      return "compas-rojo";
    case 2:
      return "compas-naranja";
    case 3:
      return "compas-verde";
    default:
      return "";
  }
};

// Función para calcular y emitir el promedio de los compases
const calcularYEmitirPromedio = () => {
  const total = estadosCompases.value.reduce((acc, estado) => acc + estado, 0);
  const promedio = (total / estadosCompases.value.length).toFixed(2);
  emit("promedio", { seccion: props.seccion, promedio });
};

// Vigilar cambios en `estadosIniciales` y reiniciar si cambian
watch(
  () => props.estadosIniciales,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      inicializarCompases();
    }
  }
);
</script>

<style scoped>
.compas-status {
  display: inline-flex;
  width: 40px;
  height: 40px;
  margin: 5px;
  cursor: pointer;
  line-height: 20px;
  border-radius: 3px;
  font-size: 16px;
  color: white;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  padding: 5px;
  margin: 5px;
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
