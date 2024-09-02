<template>
  <q-page class="text-white">
    <div class="q-pa-md text-h5 text-left header">
      <h3>Gestión del Repertorio</h3>
      <!-- Botón Flotante para Agregar Repertorio -->
      <q-btn
        fab
        color="primary"
        icon="add"
        @click="abrirDialogoObra(-1)"
        class="q-float q-bottom-right q-mr-md q-mb-md"
      />
    </div>

    <!-- Listado de Repertorios -->
    <q-list dark bordered class="q-pa-xs" separator>
      <q-item
        v-for="(obra, index) in repertorios"
        :key="obra.id"
        :style="calcularColorPromedio(obra.id)"
      >
        <!-- Sección para el promedio y botón Progreso -->
        <q-item-section class="col-2 justify-center" side>
          <div class="text-center">
            <q-item-label class="text-h6 q-mb-sm">{{
              promedios[obra.id] || 0
            }}</q-item-label>
            <q-btn
              size="sm"
              flat
              dense
              icon="trending_up"
              @click="registrarProgreso(obra)"
              color="secondary"
              label="Progreso"
            />
          </div>
        </q-item-section>

        <!-- Sección principal con título, grupo y compases -->
        <q-item-section class="col-grow">
          <q-item-label lines="1">
            <span class="text-weight-medium text-white">{{ obra.Titulo }}</span>
            <span class="text-white"> - {{ obra.Grupo }}</span>
          </q-item-label>
          <q-item-label caption lines="1">
            <span class="text-gray-5">Compases: {{ obra.Compases }}</span>
          </q-item-label>
        </q-item-section>

        <!-- Sección para los botones Editar y Eliminar -->
        <q-item-section class="col-2 q-gutter-sm justify-end">
          <q-btn
            size="sm"
            flat
            dense
            icon="edit"
            @click="abrirDialogoObra(index)"
            color="primary"
          />
          <q-btn
            size="sm"
            flat
            dense
            icon="delete"
            @click="confirmar(obra.id)"
            color="warning"
          />
        </q-item-section>
      </q-item>

      <q-item v-if="!repertorios.length" clickable>
        <q-item-section>
          <q-item-label>No hay repertorio registrado.</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Formulario para agregar/editar obra -->
    <q-dialog
      v-model="dialogoObraVisible"
      persistent
      backdrop-filter="Saturate(180%) blur(20px)"
    >
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="../../assets/favicon-32x32-orquesta.jpg" />
          </q-avatar>

          <q-toolbar-title
            ><span class="text-weight-bold">{{
              obraActual?.id ? "Editar" : "Nuevo"
            }}</span>
            Repertorio
          </q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section>
          Inserta algunos datos básicos para registrar el repertorio que deseas.
        </q-card-section>
        <q-card-actions align="center">
          <q-btn
            flat
            label="Cancelar"
            color="red-5"
            @click="cerrarDialogoObra"
          />
          <q-btn
            flat
            label="Guardar"
            color="purple"
            @click="guardarObraLocal"
          />
        </q-card-actions>
        <q-card-section>
          <q-input
            v-model="obraActual.Titulo"
            label="Título"
            outlined
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model="obraActual.Compositor"
            label="Compositor"
            outlined
            dense
            class="q-mb-sm"
            trim
          />
          <q-select
            v-model="obraActual.Grupo"
            :options="grupos"
            label="Grupo"
            outlined
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model="obraActual.Compases"
            label="Compás"
            type="number"
            outlined
            dense
            class="q-mb-sm"
            min="1"
          />
        </q-card-section>
      </q-card>
      <q-card> </q-card>
    </q-dialog>
    <!-- Diálogo para registrar progreso -->
    <q-dialog
      v-model="dialogoProgresoVisible"
      persistent
      backdrop-filter="Saturate(180%) blur(20px)"
      maximized
    >
      <ProgresoForm
        :obra="obraActual"
        :secciones="secciones"
        @guardar="guardarProgreso"
        @cancelar="cerrarDialogoProgreso"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRepertorioStore } from "../../stores/repertorioStore";
import { obtenerGruposYAlumnos } from "../../FirebaseService/database";
import ProgresoForm from "../../components/Repertorios/ProgresoForm.vue";
import { useQuasar } from "quasar";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../FirebaseService/constants";

const $q = useQuasar();
const repertorioStore = useRepertorioStore();
const {
  obtenerRepertorio,
  guardarObra,
  eliminarObra: eliminarObraStore,
} = repertorioStore;

// Variables reactivas
const dialogoProgresoVisible = ref(false);
const secciones = ref([]);
const clasificacion = ref({
  Orquesta: ["Cuerdas", "Madera", "Metal", "Percusión"],
  Coro: ["Sopranos", "Contraltos", "Tenores", "Bajos"],
  Ensamble: ["Alumnos"],
});

// Consultar promedio según el id de la obra en Firebase
const promedios = ref({}); // Para almacenar los promedios de cada obra
// Crear una función que, según el id de la obra, consulte el promedio en Firebase
const obtenerPromedio = async (id) => {
  const docRef = doc(db, "PROGRESOS", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    promedios.value[id] = docSnap.data().promedio || 0;
  } else {
    promedios.value[id] = 0;
  }
  return promedios.value[id];
};

// Calcular el color de fondo según el promedio
const calcularColorPromedio = (id) => {
  const promedio = promedios.value[id] || 0;
  const color = calcularColor(promedio);
  return {
    backgroundColor: color,
  };
};

const calcularColor = (promedio) => {
  // Color de inicio (rojo oscuro) y fin (verde)
  const rojoOscuro = { r: 200, g: 0, b: 0 };
  const verde = { r: 0, g: 128, b: 0 };

  // Interpolación lineal de color según el promedio
  const r = Math.floor(
    rojoOscuro.r + (verde.r - rojoOscuro.r) * (promedio / 3)
  );
  const g = Math.floor(
    rojoOscuro.g + (verde.g - rojoOscuro.g) * (promedio / 3)
  );
  const b = Math.floor(
    rojoOscuro.b + (verde.b - rojoOscuro.b) * (promedio / 3)
  );

  return `rgb(${r}, ${g}, ${b})`;
};

const dialogoObraVisible = ref(false);
const obraActual = ref(null);
const repertorios = computed(() => repertorioStore.repertorios);
const grupos = ref([]);

// Cargar el repertorio y los grupos desde Firebase al montar el componente
onMounted(async () => {
  await obtenerRepertorio();
  grupos.value = await obtenerGruposYAlumnos(); // Cargar los grupos disponibles
  grupos.value = grupos.value.grupos;

  // Obtener promedios para todas las obras
  for (const obra of repertorios.value) {
    await obtenerPromedio(obra.id);
  }
});

const abrirDialogoObra = (index = -1) => {
  if (index >= 0) {
    obraActual.value = { ...repertorios.value[index] };
  } else {
    obraActual.value = {
      Titulo: "",
      Compositor: "",
      Grupo: "",
      Compases: 1,
    };
  }
  dialogoObraVisible.value = true;
};

// Cerrar el diálogo de obra
const cerrarDialogoObra = () => {
  dialogoObraVisible.value = false;
};

// Guardar la obra en Firebase y actualizar el listado
const guardarObraLocal = async () => {
  if (
    obraActual.value.Titulo &&
    obraActual.value.Compositor &&
    obraActual.value.Grupo
  ) {
    await guardarObra(obraActual.value);
    cerrarDialogoObra();
  } else {
    $q.notify({
      message: "Por favor, complete todos los campos.",
      color: "negative",
      position: "top-right",
    });
  }
};
// Función para guardar el progreso en Firebase
const guardarProgreso = async (progreso) => {
  try {
    const progresoRef = doc(collection(db, "PROGRESOS"), obraActual.value.id);
    await setDoc(
      progresoRef,
      {
        obraId: obraActual.value.id,
        ...progreso,
      },
      { merge: true }
    );

    $q.notify({
      message: "Progreso registrado con éxito.",
      color: "positive",
      position: "top-right",
    });

    await obtenerPromedio(obraActual.value.id); // Actualizar el promedio en la lista

    cerrarDialogoProgreso();
  } catch (error) {
    console.error("Error al registrar el progreso:", error); // Log detallado del error
    $q.notify({
      message: "Error al registrar el progreso.",
      color: "negative",
      position: "top-right",
    });
  }
};

const confirmar = (id) => {
  $q.dialog({
    title: "Eliminar Obra",
    message: "¿Estás seguro de que deseas eliminar esta obra?",
    persistent: true,
    ok: {
      label: "Sí",
      color: "negative",
      handler: () => eliminarObra(id),
    },
    cancel: {
      label: "No",
      color: "primary",
    },
  });
};

// Eliminar una obra del repertorio
const eliminarObra = async (id) => {
  await eliminarObraStore(id);
  $q.notify({
    message: "Obra eliminada.",
    color: "negative",
    position: "top-right",
  });
};

// Función para abrir el formulario de progreso
const registrarProgreso = async (obra) => {
  obraActual.value = { ...obra };

  if (clasificacion.value.hasOwnProperty(obra.Grupo)) {
    secciones.value = clasificacion.value[obra.Grupo];
  } else {
    console.log("La variable no es igual a ninguna clave del objeto");
  }

  dialogoProgresoVisible.value = true;
};

const cerrarDialogoProgreso = () => {
  dialogoProgresoVisible.value = false;
};
</script>

<style scoped>
.text-white {
  color: #000000;
}

.q-btn {
  margin: 5px;
}

.q-item-section.top.side {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
