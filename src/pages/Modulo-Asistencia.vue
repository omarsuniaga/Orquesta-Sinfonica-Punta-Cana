<template>
  <div>
    <!-- Selección de Fecha -->
    <div class="date-selection" v-show="visible">
      <span class="text-white q-px-md">Selecciona una fecha</span>
      <div class="date-container">
        <q-date v-model="date" :events="eventos" minimal />
      </div>
    </div>

    <div class="actions-container">
      <q-btn
        @click="toggleVisible"
        flat
        color="white"
        :label="date"
        size="18px"
      />
      <q-btn
        v-if="date !== hoy"
        color="green-3"
        text-color="black"
        label="Hoy"
        @click="Nuevo_Listado"
      />

      <BuscarAlumnos
        :text="text"
        style="width: 100%"
        @onFire="eventEmittedFromChild"
      ></BuscarAlumnos>

      <q-btn-group>
        <q-btn color="blue-6" icon="today" @click="toggleVisible" />
        <q-btn
          color="blue-6"
          icon-right="save"
          @click="guardar"
          :disable="Presentes.length === 0"
        />
      </q-btn-group>
    </div>

    <!-- Botones adicionales -->
    <div class="row no-wrap q-mx-ms">
      <q-btn
        color="green-3"
        text-color="black"
        label="Repertorio"
        @click="irRepertorio"
      />
      <DescargarAsistenciasPDF
        :fecha="date"
        :grupo="grupo"
        :ausentes="Listado"
        :presentes="Presentes"
      />
      <q-btn
        color="green-3"
        text-color="black"
        label="Clase Diaria"
        @click="irClaseDiaria"
      />
    </div>

    <!-- Mensaje si no hay grupo seleccionado -->
    <div
      v-if="grupo === ''"
      class="q-pa-xl row justify-center text-weight-regular main-content"
    >
      <span class="text-white"
        >Para pasar la asistencia, selecciona un grupo</span
      >
    </div>

    <!-- Listado de alumnos -->
    <div v-else class="q-pa-xs main-content">
      <div class="row col-12 col-md-6">
        <div class="col-6">
          <div class="row justify-center">
            <div v-if="Loading">
              <q-spinner-cube color="indigo" />
            </div>
            <div
              v-if="Resultado_Busqueda.length > 0"
              class="q-gutter-sm q-pa-md"
            >
              <q-list bordered>
                <q-slide-item
                  v-for="item in Resultado_Busqueda"
                  :key="item.id"
                  class="q-my-md"
                  @left="toggleDemorado(item)"
                  @right="toggleJustificado(item)"
                  @click="comprobar(item)"
                  :class="getItemClass(item)"
                >
                  <template v-slot:left>
                    <q-icon name="alarm" color="orange" />
                    <q-item-label>{{ item.nombre }}</q-item-label>
                    <q-item-label caption>{{ item.apellido }}</q-item-label>
                  </template>
                  <template v-slot:right>
                    <q-icon name="description" color="teal" />
                    <q-item-label>{{ item.nombre }}</q-item-label>
                    <q-item-label caption>{{ item.apellido }}</q-item-label>
                  </template>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-h6">{{
                        item.nombre
                      }}</q-item-label>
                      <q-item-label caption>{{ item.apellido }}</q-item-label>
                    </q-item-section>
                    <q-item-section v-if="isDemorado(item)" avatar right>
                      <q-icon name="alarm" color="orange" />
                      <q-item-label class="text-weight-bold text-h6">{{
                        item.nombre
                      }}</q-item-label>
                      <q-item-label caption>{{ item.apellido }}</q-item-label>
                    </q-item-section>
                    <q-item-section v-if="isJustificado(item)" avatar right>
                      <q-icon name="description" color="orange" />
                      <q-item-label class="text-weight-bold text-h6">{{
                        item.nombre
                      }}</q-item-label>
                      <q-item-label caption>{{ item.apellido }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-slide-item>
              </q-list>
            </div>
            <!-- Columna de Ausentes -->
            <div v-else>
              <div class="q-pa-md" style="max-width: 400px">
                <q-toolbar class="bg-primary text-white shadow-2">
                  <q-toolbar-title>Ausentes</q-toolbar-title>
                  <q-avatar
                    clickable
                    :icon="
                      AusentesisAscending ? 'arrow_upward' : 'arrow_downward'
                    "
                    color="primary"
                    text-color="white"
                    @click="sortAusentes"
                  />
                </q-toolbar>
                <q-list>
                  <q-slide-item
                    v-for="item in Justificados"
                    :key="item.id"
                    class="q-my-md"
                    @left="toggleDemorado(item)"
                    @right="toggleJustificado(item)"
                    @click="agregarNota(item)"
                    :class="getItemClass(item)"
                    left-color="purple"
                    right-color="red"
                  >
                    <template v-slot:left>
                      <div class="row items-center">
                        Tarde<q-icon left name="alarm" />
                      </div>
                    </template>
                    <template v-slot:right>
                      <div class="row items-center">
                        Justificado<q-icon right name="description" />
                      </div>
                    </template>
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-weight-bold text-h6">{{
                          item.nombre
                        }}</q-item-label>
                        <q-item-label caption>{{ item.apellido }}</q-item-label>
                      </q-item-section>
                      <q-item-section v-if="isDemorado(item)" avatar right>
                        <q-icon name="alarm" color="orange" />
                      </q-item-section>
                      <q-item-section v-if="isJustificado(item)" avatar right>
                        <q-icon name="description" color="orange" />
                      </q-item-section>
                    </q-item>
                  </q-slide-item>
                </q-list>
                <q-list>
                  <q-slide-item
                    v-for="item in Listado"
                    :key="item.id"
                    class="q-my-md"
                    @left="toggleDemorado(item)"
                    @right="toggleJustificado(item)"
                    @click="agregar(item)"
                    :class="getItemClass(item)"
                    left-color="purple"
                    right-color="red"
                  >
                    <template v-slot:left>
                      <div class="row items-center">
                        Tarde<q-icon left name="alarm" />
                      </div>
                    </template>
                    <template v-slot:right>
                      <div class="row items-center">
                        Justificar<q-icon right name="description" />
                      </div>
                    </template>

                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-weight-bold text-h6">{{
                          item.nombre
                        }}</q-item-label>
                        <q-item-label caption>{{ item.apellido }}</q-item-label>
                      </q-item-section>
                      <q-item-section v-if="isDemorado(item)" avatar right>
                        <q-icon name="alarm" color="orange" />
                      </q-item-section>
                      <q-item-section v-if="isJustificado(item)" avatar right>
                        <q-icon name="description" color="orange" />
                      </q-item-section>
                    </q-item>
                  </q-slide-item>
                </q-list>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna de Presentes -->
        <div class="col-6">
          <div class="row justify-center">
            <div class="q-pa-md" style="max-width: 400px">
              <q-toolbar class="bg-primary text-white shadow-2">
                <q-toolbar-title>Presentes</q-toolbar-title>
                <q-avatar
                  clickable
                  :icon="
                    PresentesisAscending ? 'arrow_upward' : 'arrow_downward'
                  "
                  color="primary"
                  text-color="white"
                  @click="sortPresentes"
                />
              </q-toolbar>
              <!-- q-slider-item para los alumnos Demorados si no hay no mostrar slider -->
              <q-list>
                <q-slide-item
                  v-for="item in Demorados"
                  :key="item.id"
                  class="q-my-md"
                  @left="toggleDemorado(item)"
                  @right="toggleJustificado(item)"
                  @click="quitar(item)"
                  :class="getItemClass(item)"
                  left-color="purple"
                  right-color="red"
                >
                  <template v-slot:left>
                    <div class="row items-center">
                      Tarde<q-icon left name="alarm" />
                    </div>
                  </template>
                  <template v-slot:right>
                    <div class="row items-center">
                      Justificar<q-icon right name="alarm" />
                    </div>
                  </template>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-h6">{{
                        item.nombre
                      }}</q-item-label>
                      <q-item-label caption>{{ item.apellido }}</q-item-label>
                    </q-item-section>
                    <q-item-section v-if="isDemorado(item)" avatar right>
                      <q-icon name="alarm" color="white" />
                    </q-item-section>
                  </q-item>
                </q-slide-item>
              </q-list>

              <q-list bordered separator>
                <q-slide-item
                  v-for="item in Presentes"
                  :key="item.id"
                  class="q-my-md"
                  @left="toggleDemorado(item)"
                  @right="toggleJustificado(item)"
                  @click="quitar(item)"
                  :class="getItemClass(item)"
                  left-color="purple"
                  right-color="red"
                >
                  <template v-slot:left>
                    <div class="row items-center">
                      Tarde<q-icon left name="alarm" />
                    </div>
                  </template>
                  <template v-slot:right>
                    <div class="row items-center">
                      {{ item.nombre }} Justificado
                      <q-icon right name="description" />
                    </div>
                  </template>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-h6">{{
                        item.nombre
                      }}</q-item-label>
                      <q-item-label caption>{{ item.apellido }}</q-item-label>
                    </q-item-section>
                    <q-item-section v-if="isDemorado(item)" avatar right>
                      <q-icon name="alarm" color="white" />
                    </q-item-section>
                  </q-item>
                </q-slide-item>
              </q-list>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  registrarAsistenciaDeHoy,
  buscarAsistenciasPorFecha,
  buscarAlumnoPorId,
  obtenerMarcasDelCalendario,
  buscarAsistenciasPorFechaYGrupo,
  obtenerAlumnos,
  agregarJustificados,
} from "../FirebaseService/database";
import moment from "moment";
import BuscarAlumnos from "src/components/Buscar-Alumnos.vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import DescargarAsistenciasPDF from "src/components/DescargarAsistenciasPDF.vue";
import { ref, onMounted, toRaw } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const $q = useQuasar();
const router = useRouter();
let nota = ref([]);
let grupo = ref(route.params.catedra || "");
let date = ref(moment().format("YYYY-MM-DD"));
let hoy = ref(moment().format("YYYY-MM-DD"));
let Resultado_Busqueda = ref([]);
let Presentes = ref([]);
let Listado = ref([]);
let Demorados = ref([]);
let Justificados = ref([]);
let text = ref(null);
let Loading = ref(false);
let visible = ref(false);
let pdf = ref(false);
let eventos = ref([]);
let AusentesisAscending = ref(true);
let PresentesisAscending = ref(true);

const getItemClass = (item) => {
  if (isDemorado(item)) return "bg-morado-claro";
  if (isJustificado(item)) return "bg-naranja-claro";
  if (isPresente(item)) return "bg-verde-claro";
  return "bg-rojo-claro";
};

const isPresente = (item) => Presentes.value.some((e) => e.id === item.id);

const isDemorado = (item) => Demorados.value.some((e) => e.id === item.id);

const isJustificado = (item) =>
  Justificados.value.some((e) => e.id === item.id);

const toggleDemorado = (item) => {
  // Marcar como demorado
  if (!isDemorado(item)) {
    Demorados.value.push(item); // agregar al array demorados
    Presentes.value = Presentes.value.filter((e) => e.id !== item.id); // quitar de presentes
    Justificados.value = Justificados.value.filter((e) => e.id !== item.id); // quitar de Justificados
    Listado.value = Listado.value.filter((e) => e.id !== item.id); //quitar de ausentes
  } else {
    Presentes.value = Presentes.value.filter((e) => e.id !== item.id); //quitar de presentes
    Demorados.value = Demorados.value.filter((e) => e.id !== item.id); // quitar de Demorados
    Listado.value = Listado.value.filter((e) => e.id !== item.id); //quitar de ausentes
    Justificados.value = Justificados.value.filter((e) => e.id !== item.id); // quitar de Justificados
  }
};

const toggleJustificado = (item) => {
  // Marcar como justificado
  if (!isJustificado(item)) {
    Justificados.value.push(item); // agregar al array justificados
    Presentes.value = Presentes.value.filter((e) => e.id !== item.id); // quitar de Presentes
    Listado.value = Listado.value.filter((e) => e.id !== item.id); //quitar de ausentes
    // Listado.value.unshift({ ...item, asistencia: false }); // agregar a Listado
    Demorados.value = Demorados.value.filter((e) => e.id !== item.id); // quitar de Demorados
  } else {
    Demorados.value = Demorados.value.filter((e) => e.id !== item.id); // quitar de Demorados
    Listado.value.unshift({ ...item, asistencia: false }); // agregar a Listado
    Justificados.value = Justificados.value.filter((e) => e.id !== item.id); // quitar de Justificados
  }
};

const sortPresentes = () => {
  if (PresentesisAscending.value) {
    Presentes.value.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else {
    Presentes.value.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }
  PresentesisAscending.value = !PresentesisAscending.value;
};

const sortAusentes = () => {
  if (AusentesisAscending.value) {
    Listado.value.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else {
    Listado.value.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }
  AusentesisAscending.value = !AusentesisAscending.value;
};

//agregar nota
const agregarNota = (item) => {
  $q.dialog({
    title: "Agregar Nota",
    message:
      "Ingresa la justificación de  " + item.nombre + " " + item.apellido,
    prompt: {
      model: "",
      type: "text",
    },
    cancel: true,
    persistent: true,
  }).onOk((data) => {
    if (data) {
      nota.value.push({ id: item.id, justificacion: data, fecha: date.value });
    }
  });
};

const comprobar = (item) => {
  const index = Presentes.value.findIndex((e) => e.id === item.id);
  if (index !== -1) {
    $q.notify({
      message: "Ya está en la lista de presentes",
      color: "red-2",
      textColor: "red-9",
    });
  } else {
    agregar(item);
  }
};

const agregar = (item) => {
  const index = Listado.value.findIndex((e) => e.id === item.id);
  if (index !== -1) {
    Listado.value.splice(index, 1);
  }
  Presentes.value.unshift({ ...item, asistencia: true });
};

const quitar = (item) => {
  Presentes.value = Presentes.value.filter((e) => e.id !== item.id);
  Listado.value.unshift({ ...item, asistencia: false });
  // Quitar demorado
  Demorados.value = Demorados.value.filter((e) => e.id !== item.id);
  //quitar Justificado
  Justificados.value = Justificados.value.filter((e) => e.id !== item.id);
};

const guardar = async () => {
  try {
    await registrarAsistenciaDeHoy(
      Presentes.value.map((e) => e.id),
      Listado.value.map((e) => e.id),
      Demorados.value.map((e) => e.id),
      Justificados.value.map((e) => e.id),
      date.value,
      grupo.value,
      nota.value
    );
    $q.notify({
      message: "Listado Guardado con éxito",
      color: "green-4",
      textColor: "white",
    });
  } catch (error) {
    $q.notify({
      message: `Ha ocurrido un Error: ${error}`,
      color: "red-4",
      textColor: "white",
    });
  }
};

const mostrarAlumnosPorGrupoOInstrumento = (Alumnos, grupo) => {
  let alumnosFiltrados = Alumnos.filter(
    (alumno) =>
      (Array.isArray(alumno.grupo) && alumno.grupo.includes(grupo)) ||
      (alumno.instrumento && alumno.instrumento.includes(grupo))
  );

  alumnosFiltrados.forEach((alumno) => {
    Listado.value.push({ ...alumno, asistencia: false });
  });
};

const agregarAlumnoALista = async (id, estado) => {
  try {
    const doc = await buscarAlumnoPorId(id);
    if (doc && doc.id === id) {
      // Agrupar alumnos según su estado
      if (estado === "presente") {
        Presentes.value.push({ ...doc, estado });
      }
      if (estado === "ausente") {
        Listado.value.push({ ...doc, estado });
      }
      if (estado === "justificado") {
        Justificados.value.push({ ...doc, estado });
      }
      if (estado === "demorado") {
        Demorados.value.push({ ...doc, estado });
      }
    }
  } catch (error) {
    console.error("Error al agregar alumno a la lista:", error);
  }
};

const Filtrar = async (fecha, grupo) => {
  if (!fecha || !grupo) {
    $q.notify({
      message: "La fecha o el grupo están indefinidos",
      color: "red-4",
      textColor: "white",
    });
    return;
  }

  visible.value = false;
  Listado.value = [];
  Presentes.value = [];
  Demorados.value = [];
  Justificados.value = [];

  try {
    const registros = await buscarAsistenciasPorFechaYGrupo(fecha, grupo);
    const Alumnos = await obtenerAlumnos();

    if (registros && registros.length > 0) {
      const { presentes, ausentes, justificados, demorados } =
        registros[0].Data;
      presentes.forEach((id) => agregarAlumnoALista(id, "presente"));
      demorados.forEach((id) => agregarAlumnoALista(id, "demorado"));
      ausentes.forEach((id) => agregarAlumnoALista(id, "ausente"));
      justificados.forEach((id) => agregarAlumnoALista(id, "justificado"));
      console.log("Justificado:", justificados);
    } else {
      mostrarAlumnosPorGrupoOInstrumento(Alumnos, grupo);
    }
    pdf.value = fecha && grupo !== "All";
  } catch (error) {
    console.error("Error al filtrar:", error);
  }
};

const toggleVisible = () => {
  visible.value = !visible.value;
};

const irRepertorio = () => {
  router.push({
    name: "GestionarRepertorio",
    params: { grupoSeleccionado: toRaw(grupo.value) },
  });
};
// Filtrar alumnos por nombre o apellido
const eventEmittedFromChild = (res) => {
  if (res.length !== 0) {
    Resultado_Busqueda.value = res.map((e) => ({ ...e }));
  } else {
    Resultado_Busqueda.value = [];
  }
};
function finalize(reset) {
  timer = setTimeout(() => {
    reset();
  }, 1000);
}

onMounted(async () => {
  try {
    eventos.value = await obtenerMarcasDelCalendario();
    await Filtrar(date.value, grupo.value);
  } catch (error) {
    console.error("Error al inicializar:", error);
  }
});
</script>
<style scoped>
.bg-morado-claro {
  background-color: #d8b3ff; /* Morado claro */
}

.bg-naranja-claro {
  background-color: #ffcc99; /* Naranja claro */
}

.bg-rojo-claro {
  background-color: #ffcccc; /* Rojo claro */
}

.bg-verde-claro {
  background-color: #ccffcc; /* Verde claro */
}
</style>
