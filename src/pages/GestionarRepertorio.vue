<template>
  <q-list
    bordered
    class="rounded-borders"
    style="max-width: 100vw; background-color: aliceblue"
  >
    <q-item-label header>Repertorio General</q-item-label>

    <q-item>
      <q-item-section top class="col-2 gt-sm">
        <q-item-label class="q-mt-sm">GitHub</q-item-label>
      </q-item-section>

      <q-item-section top>
        <q-item-label lines="1">
          <span class="text-weight-medium">Te Deum</span>
          <span class="text-grey-8"> - Orquesta</span>
        </q-item-label>
        <q-item-label caption lines="1"> Compases: 1 - 41 </q-item-label>
        <q-item-label
          lines="1"
          class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
        >
          <span class="cursor-pointer">Agregar Avances</span>
        </q-item-label>
      </q-item-section>

      <q-item-section top side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
          <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
          <q-btn size="12px" flat dense round icon="more_vert" />
        </div>
      </q-item-section>
    </q-item>
    <q-separator spaced />
  </q-list>

  <q-list bordered dark>
    <ObraCard
      v-for="(obra, index) in repertorios"
      :key="obra.id"
      :obra="obra"
      @editar="abrirDialogoObra(index)"
      @eliminar="eliminarObra(obra.id)"
    />
  </q-list>

  <ObraForm
    v-if="dialogoObraVisible"
    :obra="obraActual"
    @guardar="guardarObraLocal"
    @cancelar="cerrarDialogoObra"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRepertorioStore } from "../stores/repertorioStore";
import ObraCard from "../components/Repertorios/ObraCard.vue";
import ObraForm from "../components/Repertorios/ObraForm.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

// Inicializamos el store de Pinia
const repertorioStore = useRepertorioStore();
const { obtenerRepertorio, guardarObra, eliminarObra } = repertorioStore;

// Variables reactivas
const dialogoObraVisible = ref(false);
const obraActual = ref(null);
const repertorios = ref([
  {
    id: 1,
    Compases: {
      desde: 1,
      hasta: 10,
    },
    Compositor: "Chanpertier",
    Dificultad: "Intermedio",
    EstadoObra: [1, 2, 3, 2, 1, 1, 2, 3, 3, 2],
    FilaEvaluacion: {
      cuerdas: 1,
      vientoMetal: 1,
      vientoMadera: 1,
    },
    Grupo: "Orquesta",
    Participantes: [],
    TiempoEstimado: "3 semanas",
    Titulo: "Te Deum",
  },
]);
onMounted(async () => {
  // repertorios.value = await obtenerRepertorio();
});

const abrirDialogoObra = (index = -1) => {
  $q.dialog({
    component: ObraForm,
    componentProps: {
      obra: index === -1 ? null : repertorios.value[index],
    },
  }).onOk(async (data) => {
    if (index === -1) {
      await guardarObra(data);
    } else {
      repertorios.value[index] = data;
    }
  });
};

const cerrarDialogoObra = () => {
  $q.dialog({
    component: ObraForm,
  }).hide();
};

console.log("repertorios", repertorios.value);

const guardarObraLocal = async (obra) => {
  await guardarObra(obra);
  cerrarDialogoObra();
};
</script>

<style scoped>
.bg-dark {
  background-color: #306b86;
}

.text-white {
  color: #ffffff;
}

/* Estilos adicionales para la lista */
.q-list {
  background-color: #21177a;
  border-radius: 8px;
}

.q-btn {
  margin: 5px;
}
</style>
