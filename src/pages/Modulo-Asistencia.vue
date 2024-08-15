<template>
  <q-layout>
    <q-page-container>
      <div class="q-my-sm col-12" style="min-width: 375px; width: 100%">
        <div class="justify-center flex">
          <div class="col-auto q-mx-sm">
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
          <div class="row">
            <BuscarAlumnos
              :text="text"
              style="width: 100%"
              @onFire="eventEmittedFromChild"
            ></BuscarAlumnos>
          </div>
        </div>
        <div class="justify-center flex row" style="min-width: 375px; width: 100%">
          <q-btn-toggle
            class="col-auto flex justify-around"
            v-model="grupo"
            rounded
            spread
            stack
            no-caps
            no-wrap
            toggle-color="primary"
            color="green"
            text-color="white"
            :options="niveles"
          >
          </q-btn-toggle>
        </div>
      </div>

      <div class="col-12" v-if="visible">
        <span class="text-white q-px-md">Selecciona una fecha</span>
        <div class="q-pa-sm flex justify-center scrollList">
          <div style="width: 100%; max-width: 400px; min-width: 100px">
            <div class="q-pa-md">
              <div class="q-gutter-md row items-center">
                <q-date
                  v-model="date"
                  :events="marcas"
                  minimal
                  today-btn
                  mask="YYYY-MM-DD"
                  event-color="red"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="q-px-md flex justify-center"
        v-else
        style="min-width: 375px; width: 100%"
      >
        <q-btn @click="toggleVisible" flat color="white" :label="date" size="18px" />
        <div class="q-pa-sm">
          <q-btn
            v-if="date !== hoy"
            color="green-3"
            text-color="black"
            label="Hoy"
            @click="Nuevo_Listado()"
          />
        </div>
        <div v-if="pdf" class="flex justify-center">
          <q-btn color="green-3" text-color="black" label="Diario" @click="eleccion()" />
          <DescargarAsistenciasPDF
            :fecha="date"
            :grupo="grupo"
            :ausentes="Listado"
            :presentes="Presentes"
          />
        </div>
      </div>
      <div
        v-if="grupo === ''"
        class="q-pa-xl row justify-center text-weight-regular"
        style="min-width: 375px; width: 100%"
      >
        <span class="text-white">Para pasar la asistencia, selecciona un grupo</span>
      </div>
      <div v-else class="q-pa-xs" style="min-width: 375px; width: 100%">
        <div class="row col-12">
          <div class="col-6">
            <span class="text-body1 text-white">Ausentes</span>
            <div class="row justify-start">
              <q-btn icon="sort" @click="sortAusentes" class="q-ma-sm" color="red-3" />
            </div>
            <div v-if="Loading">
              <q-spinner-cube color="indigo" />
            </div>
            <div v-else class="row flex justify-center scrollList" ref="chatRef">
              <div
                v-if="Resultado_Busqueda.length > 0"
                style="width: 100%; max-width: 700px; min-width: 140px scrollList"
              >
                <q-card
                  class="q-ma-xs bg-red-3"
                  v-for="(item, index) in Resultado_Busqueda"
                  :key="index"
                  @click="comprobar(item)"
                  v-touch-hold:2000.mouse="handleHold"
                >
                  <q-item v-if="!item.asistencia" :id="item.id">
                    <q-item-section>
                      <q-item-label class=""
                        >{{ item.nombre }}
                        {{ $q.screen.gt.sm ? item.apellido : "" }}</q-item-label
                      >
                      <q-item-label class="">
                        <q-virtual-scroll
                          :items="item.grupo"
                          virtual-scroll-horizontal
                          v-slot="{ item, index }"
                        >
                          <div :key="index" :class="item.class" class="q-px-sm">
                            <q-badge top color="red" :label="item" />
                          </div>
                        </q-virtual-scroll>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
              <div v-else>
                <q-card
                  class="q-ma-xs bg-red-3"
                  v-for="(item, index) in Listado"
                  :key="index"
                  @click="agregar(item)"
                  v-touch-hold:2000.mouse="handleHold"
                >
                  <q-item v-if="!item.asistencia" :id="item.id">
                    <q-item-section avatar>
                      <q-avatar>
                        <q-icon
                          :name="item.nombre[0]"
                          size="sm"
                          style="
                            background-color: rgba(152, 80, 54, 0.685);
                            border-radius: 50%;
                            padding: 10px;
                            align-items: center;
                            color: white;
                          "
                        />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-regular"
                        >{{ item.nombre }}
                        {{ $q.screen.gt.xs ? item.apellido : "" }}</q-item-label
                      >
                      <q-item-label>
                        <q-virtual-scroll
                          :items="item.grupo"
                          virtual-scroll-horizontal
                          v-slot="{ item, index }"
                        >
                          <div :key="index" :class="item.class" class="q-ma-xs">
                            <q-badge top color="red-6" :label="item" />
                          </div>
                        </q-virtual-scroll>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
            </div>
          </div>
          <div class="col-6">
            <span class="text-body1 row text-white justify-end">Presentes</span>
            <div class="row justify-end">
              <q-btn icon="sort" @click="sortPresentes" class="q-ma-sm" color="green-3" />
            </div>
            <div class="row flex justify-center scrollList" ref="chatRef">
              <div style="width: 100%; max-width: 700px; min-width: 140px scrollList">
                <q-card v-if="Presentes.length === 0" class="q-ma-xs bg-white">
                  <q-item> No hay registros </q-item>
                </q-card>
                <q-card
                  v-else
                  class="q-ma-xs bg-green-3"
                  v-for="(item, index) in Presentes"
                  :key="index"
                  v-touch-hold:2000.mouse="handleHold"
                  @click="quitar(item)"
                >
                  <q-item :id="item.id">
                    <q-item-section avatar>
                      <q-avatar>
                        <q-icon
                          :name="item.nombre[0]"
                          size="sm"
                          style="
                            background-color: rgba(46, 119, 63, 0.685);
                            border-radius: 50%;
                            padding: 10px;
                            align-items: center;
                            color: white;
                          "
                        />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section class="text-weight-regular">
                      <q-item-label
                        >{{ item.nombre }}
                        {{ $q.screen.gt.xs ? item.apellido : "" }}</q-item-label
                      >
                      <q-item-label caption>
                        <q-virtual-scroll
                          :items="item.grupo"
                          virtual-scroll-horizontal
                          v-slot="{ item, index }"
                        >
                          <div :key="index" :class="item.class" class="q-ma-xs">
                            <q-badge top color="green-6" :label="item" />
                          </div>
                        </q-virtual-scroll>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {
  registrarAsistenciaDeHoy,
  buscarAsistenciasPorFecha,
  buscarAlumnoPorId,
  obtenerMarcasDelCalendario,
  buscarAsistenciasPorFechaYGrupo,
  obtenerAlumnos,
  obtenerConfiguraciones,
} from "../FirebaseService/database";
import moment from "moment";
import { ref, onMounted, watchEffect, reactive, watch } from "vue";
import BuscarAlumnos from "src/components/Buscar-Alumnos.vue";
import { useRouter } from "vue-router";
import { Dialog, useQuasar } from "quasar";
import DescargarAsistenciasPDF from "src/components/DescargarAsistenciasPDF.vue";

const $q = useQuasar();
const router = useRouter();

// Manejo de estados reactivamente para la fecha y otros datos
let date = ref(moment().format("YYYY-MM-DD"));
let marcas = ref(["2024-08-10"]); // Fechas con eventos
let hoy = ref(moment().format("YYYY-MM-DD"));
let Resultado_Busqueda = ref([]);
let Presentes = ref([]);
let Listado = ref([]);
let grupo = ref("");
let text = ref(null);
let Loading = ref(false);
let visible = ref(false);
let pdf = ref(false);
let niveles = ref([]);

let clickCountAusentes = ref(0);
let clickCountPresentes = ref(0);

// Función para alternar la visibilidad de la selección de fecha
const toggleVisible = () => {
  visible.value = !visible.value;
};

// Función para ordenar la lista de presentes
const sortPresentes = () => {
  clickCountPresentes.value = (clickCountPresentes.value + 1) % 2;
  Presentes.value.sort((a, b) => {
    return clickCountPresentes.value === 0
      ? a.nombre.localeCompare(b.nombre)
      : b.nombre.localeCompare(a.nombre);
  });
};

// mensaje usando q
function mensaje(mensaje, color) {
  $q.notify({
    message: mensaje,
    color,
    textColor: "white",
    icon: "aler",
  });
}

// Función para ordenar la lista de ausentes
const sortAusentes = () => {
  clickCountAusentes.value = (clickCountAusentes.value + 1) % 2;
  Listado.value.sort((a, b) => {
    return clickCountAusentes.value === 0
      ? a.nombre.localeCompare(b.nombre)
      : b.nombre.localeCompare(a.nombre);
  });
};

// Función para manejar el evento de mantener presionado
function handleHold({ evt }) {
  const id = evt.path[2].id;
  router.push(`/Detalles_Alumnos/${id}`);
}

// Función para manejar eventos del componente hijo BuscarAlumnos
const eventEmittedFromChild = (res) => {
  Resultado_Busqueda.value = res.length ? res.map((e) => ({ ...e })) : [];
};

// Función para comprobar si un alumno ya está en la lista de presentes
const comprobar = (item) => {
  const index = Presentes.value.findIndex((e) => e.id === item.id);
  if (index !== -1) {
    $q.notify({
      message: "Ya está en la lista de presentes",
      color: "red-2",
      textColor: "red-9",
      icon: "priority_high",
    });
  } else {
    agregar(item);
  }
};

// Función para agregar un alumno a la lista de presentes
const agregar = (item) => {
  const index = Listado.value.findIndex((e) => e.id === item.id);
  if (index !== -1) {
    Listado.value.splice(index, 1);
  }
  Presentes.value.unshift({ ...item, asistencia: true });
  Listado.value = Listado.value.filter((e) => e.id !== item.id);
};

// Función para quitar un alumno de la lista de presentes
const quitar = (item) => {
  const index = Presentes.value.findIndex((e) => e.id === item.id);
  if (index !== -1) {
    Presentes.value.splice(index, 1);
  }
  Listado.value.unshift({ ...item, asistencia: false });
  Presentes.value = Presentes.value.filter((e) => e.id !== item.id);
};

// Función para guardar la asistencia en Firebase
const guardar = async () => {
  const Array_Ausentes = Listado.value.map((e) => e.id);
  const Array_Presentes = Presentes.value.map((e) => e.id);
  const Fecha = date.value;
  const Grupo = grupo.value;
  try {
    await registrarAsistenciaDeHoy(Array_Presentes, Array_Ausentes, Fecha, Grupo);
    $q.notify({
      message: "Listado Guardado con éxito",
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
    });
  } catch (error) {
    $q.notify({
      message: `Ha ocurrido un Error: ${error}`,
      color: "red-4",
      textColor: "white",
      icon: "priority_high",
    });
  }
};

// Función para crear un nuevo listado de asistencia
const Nuevo_Listado = () => {
  resetear();
  date.value = hoy.value;
  Buscar();
};

// Función para resetear las listas de presentes y ausentes
const resetear = () => {
  Presentes.value = [];
  Listado.value = [];
};

// Función para cargar las marcas del calendario
const cargarMarcasDelCalendario = async () => {
  try {
    const fechasConEventos = await obtenerMarcasDelCalendario();
    marcas.value = fechasConEventos; // Asigna las fechas a la variable reactiva
  } catch (error) {
    console.error("Error al cargar marcas del calendario: ", error);
  }
};
// Función para filtrar los registros por fecha y grupo
const Filtrar = async (fecha, grupo) => {
  if (!fecha || !grupo) {
    mensaje("La fecha o el grupo están indefinidos", "red-4");
    console.error("La fecha o el grupo están indefinidos");
    return;
  }

  visible.value = false;
  resetear();

  try {
    let registros = await buscarAsistenciasPorFechaYGrupo(fecha, grupo);
    let Alumnos = await obtenerAlumnos();

    if (registros && registros.length > 0) {
      const { presentes, ausentes } = registros[0].Data;

      await Promise.all([
        ...presentes.map((id) => agregarAlumnoALista(id, true)),
        ...ausentes.map((id) => agregarAlumnoALista(id, false)),
      ]);
    } else {
      mostrarAusentes(Alumnos, grupo);
    }
    pdf.value = fecha && grupo !== "All";
  } catch (error) {
    console.error("Error al filtrar asistencias:", error);
  }
};

// Función para mostrar alumnos ausentes si no hay registros
const mostrarAusentes = (Alumnos, grupo) => {
  let alumnosFiltrados = Alumnos.filter((elem) => elem.grupo.includes(grupo));
  alumnosFiltrados.forEach((elem) => Listado.value.push({ ...elem, asistencia: false }));
  Listado.value.sort((a, b) => a.nombre.localeCompare(b.nombre));
};

// Función para agregar un alumno a la lista de presentes o ausentes
const agregarAlumnoALista = async (id, asistencia) => {
  try {
    const doc = await buscarAlumnoPorId(id);
    if (doc && doc.id === id) {
      const lista = asistencia ? Presentes.value : Listado.value;
      lista.push({ ...doc, asistencia });
    }
  } catch (error) {
    console.error("Error al agregar alumno a la lista:", error);
  }
};

// Función para buscar asistencias por fecha
const Buscar = async (fecha) => {
  try {
    const Data = await buscarAsistenciasPorFecha(fecha);
    if (Data !== null || date.value === hoy.value) {
      resetear();
      visible.value = false;
    }
  } catch (error) {
    console.error("Error al buscar asistencias por fecha:", error);
  }
};

watchEffect(async () => {
  if (date.value) {
    await Buscar(date.value);
  }
});

watch([date, grupo], async ([newDate, newGroup], [oldDate, oldGroup]) => {
  if (newDate !== oldDate || newGroup !== oldGroup) {
    await Filtrar(newDate, newGroup);
  }
});

// Función para convertir el array de configuraciones a objetos de nivel
function convertirArrayAObjeto(array) {
  niveles.value = array.map((item) => ({
    label: item,
    value: item,
  }));
}

// Configuración inicial al montar el componente
onMounted(async () => {
  try {
    cargarMarcasDelCalendario();
    let grupos = await obtenerConfiguraciones();
    convertirArrayAObjeto(grupos);
  } catch (error) {
    console.error("Error al obtener marcas del calendario:", error);
  }
});
</script>

<style scoped>
.scrollList {
  height: calc(100vh - (60px + 60px));
  overflow-y: scroll;
}
</style>
