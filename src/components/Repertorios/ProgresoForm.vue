<template>
  <q-card>
    <q-toolbar>
      <q-avatar>
        <img src="../../assets/favicon-96x96-orquesta.jpg" />
      </q-avatar>

      <q-toolbar-title
        ><span class="text-weight-bold">Registrar</span>
        Progreso</q-toolbar-title
      >

      <q-btn flat round dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section>
      Según el repertorio seleccionado, registra el progreso de cada compás la
      obra. Al presionar cada compás podrás definir el progreso del mismo.
      <q-space />
      <span class="text-weight-bold text-red">Rojo</span> representa un compás
      no aprendido
      <q-space />
      <span class="text-weight-bold text-orange-8">Naranja</span> un compás en
      proceso.
      <q-space />
      <span class="text-weight-bold text-green">Verde</span> un compás
      aprendido.
    </q-card-section>
    <q-card-section>
      <!-- Selector de sección -->
      <q-select
        v-model="seccionSeleccionada"
        :options="secciones"
        label="Seleccionar Sección"
        outlined
        dense
        class="q-mb-sm w-70 mx-auto"
        @update:model-value="cargarProgresoSeccion"
      />
    </q-card-section>

    <!-- Botones de acción -->
    <q-card-actions align="center" v-if="seccionSeleccionada">
      <q-btn flat label="Cancelar" color="red-8" @click="$emit('cancelar')" />
      <q-btn flat label="Guardar" color="purple" @click="guardarProgreso" />
    </q-card-actions>

    <SeccionProgreso
      v-if="seccionSeleccionada"
      :seccion="seccionSeleccionada"
      :compases="convertirCompases(props.obra.Compases)"
      :estados-iniciales="progresoSecciones[seccionSeleccionada]?.estados || []"
      @actualizar="actualizarProgreso"
      @promedio="actualizarPromedio"
    />
  </q-card>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";
import SeccionProgreso from "./SeccionProgreso.vue";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";
import { db } from "../../FirebaseService/constants";

// Definir las props que recibe el componente
const props = defineProps({
  obra: {
    type: Object,
    required: true,
  },
  secciones: {
    type: Array,
    required: true,
  },
});

const seccionSeleccionada = ref("");
const progresoSecciones = ref({});
const promedioSecciones = ref({});
const emit = defineEmits(["guardar", "cancelar"]);

const convertirCompases = (compases) => {
  return parseInt(compases, 10);
};

// Limpiar el progreso de la sección seleccionada
const limpiarProgreso = () => {
  progresoSecciones.value[seccionSeleccionada.value] = {
    estados: Array(convertirCompases(props.obra.Compases)).fill(1),
    calificacion: 0,
  };
};

// Extraer de firebase el progreso de la sección seleccionada
const cargarProgresoSeccion = async (seccion) => {
  if (!progresoSecciones.value[seccion]) {
    try {
      const progresoRef = doc(collection(db, "PROGRESOS"), props.obra.id);
      const progresoSnap = await getDoc(progresoRef);

      if (progresoSnap.exists()) {
        const progresoData = progresoSnap.data();
        if (
          progresoData.progresoSecciones &&
          progresoData.progresoSecciones[seccion]
        ) {
          progresoSecciones.value[seccion] =
            progresoData.progresoSecciones[seccion];
        } else {
          limpiarProgreso();
        }
      } else {
        limpiarProgreso();
      }
    } catch (error) {
      console.error("Error al cargar el progreso desde Firebase:", error);
      limpiarProgreso();
    }
  }
};

const actualizarProgreso = ({ seccion, estadosCompases }) => {
  const calificacion = calcularCalificacion(estadosCompases);
  progresoSecciones.value[seccion] = {
    estados: estadosCompases,
    calificacion: calificacion,
  };
};

const actualizarPromedio = ({ seccion, promedio }) => {
  promedioSecciones.value[seccion] = parseFloat(promedio);
};

const guardarProgreso = async () => {
  const progresoFiltrado = filtrarProgresoSecciones(progresoSecciones.value);

  if (Object.keys(progresoFiltrado).length === 0) {
    console.error("No hay progreso válido para guardar.");
    return;
  }

  const promedioGeneral = calcularPromedioGeneral();
  const progreso = {
    obraId: props.obra.id,
    progresoSecciones: progresoFiltrado,
    promedio: promedioGeneral,
    fecha: new Date().toISOString(),
  };

  try {
    const progresoRef = doc(collection(db, "PROGRESOS"), props.obra.id);
    await setDoc(progresoRef, progreso, { merge: true });

    emit("guardar", progreso);

    console.log("Progreso guardado en Firestore:", progreso);
  } catch (error) {
    console.error("Error al guardar el progreso:", error);
  }
};

const filtrarProgresoSecciones = (progreso) => {
  const progresoFiltrado = {};

  Object.keys(progreso).forEach((seccion) => {
    if (progreso[seccion].estados && progreso[seccion].estados.length > 0) {
      progresoFiltrado[seccion] = progreso[seccion];
    }
  });

  return progresoFiltrado;
};

const calcularCalificacion = (estados) => {
  let total = 0;
  estados.forEach((estado) => {
    total += estado;
  });
  return (total / estados.length).toFixed(2);
};

const calcularPromedioGeneral = () => {
  const total = Object.values(promedioSecciones.value).reduce(
    (acc, promedio) => acc + promedio,
    0
  );
  const cantidad = Object.keys(promedioSecciones.value).length;

  return cantidad ? (total / cantidad).toFixed(2) : 0;
};
</script>

<style>
.card {
  width: 70%;
  max-width: 600px;
  margin: 0 auto;
}
</style>
