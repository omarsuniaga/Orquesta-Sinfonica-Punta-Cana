<template>
  <q-layout>
    <q-page-container>
      <div class="q-my-sm col-12" style="min-width: 375px; width: 100%">
        <div class="justify-center flex">
          <div class="col-auto q-mx-sm">
            <q-btn-group>
              <q-btn color="blue-6" icon="today" @click="visible = !visible" />
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
            :options="[
              { label: 'Inicio 1', value: 'Iniciacion 1' },
              { label: 'Inicio 2', value: 'Iniciacion 2' },
              { label: 'Coro', value: 'Coro' },
              { label: 'Orquesta', value: 'Orquesta' },
            ]"
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
                  :events="events"
                  minimal
                  today-btn
                  mask="YYYY-MM-DD"
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
        <q-btn @click="visible = !visible" flat color="white" :label="date" size="18px" />

        <q-btn
          color="white"
          text-color="black"
          label="Hoy"
          @click="Nuevo_Listado()"
          v-if="date !== hoy"
          round
        />
      </div>
      <div
        v-if="grupo === 'All'"
        class="q-pa-xl flex justify-center text-weight-regular"
        style="min-width: 375px; width: 100%"
      >
        <span class="text-white">Para pasar la asistencia, selecciona un grupo </span>
      </div>

      <div v-else class="q-pa-xs" style="min-width: 375px; width: 100%">
        <div class="row col-12">
          <div class="col-6">
            <span class="text-body1 text-white">Ausentes</span>
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
                      <q-item-label class="scrollList">
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
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
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
            <span class="text-body1 text-white">Presentes</span>
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
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section class="text-weight-regular">
                      <q-item-label>
                        {{ item.nombre }}
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
// import { useCounterStore } from "src/stores/example-store";
import {
  Asistencia_de_Hoy,
  Buscar_Por_Fecha,
  Buscar_Alumno,
  Mostrar_Listado,
  Eventos_Calendario,
  Buscar_Grupo,
} from "../firebase";
import moment from "moment";
import { ref, onMounted, watchEffect, reactive } from "vue";
// import HistorialAsistencias from "src/components/Historial-Asistencias.vue";
import BuscarAlumnos from "src/components/Buscar-Alumnos.vue";
import { useRouter } from "vue-router";
import { Dialog, useQuasar } from "quasar";
const $q = reactive(useQuasar());
// const store = useCounterStore();
const router = useRouter();
// let posicion = useRouter().currentRoute._rawValue.params.posicion;
let date = ref(moment().format("YYYY-MM-DD"));
let hoy = ref(moment().format("YYYY-MM-DD"));
let Resultado_Busqueda = ref([]);
let Presentes = ref([]);
let Listado = ref([]);
let events = ref([]);
let grupo = ref("All");
let text = ref(null);
let Loading = ref(false);
let visible = ref(false);
function handleHold({ evt }) {
  let id = evt.path[2].id;
  return router.push(`/Detalles_Alumnos/${id}`);
}
const eventEmittedFromChild = (res) => {
  if (res.length != 0) {
    Resultado_Busqueda.value = res.map((e) => ({ ...e }));
    return Resultado_Busqueda.value;
  } else {
    Resultado_Busqueda.value.length = 0;
  }
};
const comprobar = async (item) => {
  let index = Presentes.value.findIndex((e) => e.id === item.id);
  index !== -1
    ? $q.notify({
        message: "Ya esta en la lista de presentes",
        color: "red-2",
        textColor: "red-9",
        icon: "priority_high",
      })
    : agregar(item);
};
const agregar = async (item) => {
  let index = Listado.value.findIndex((e) => e.id === item.id);
  index !== -1 ? Listado.value.splice(index, 1) : null;
  Presentes.value.unshift({ ...item, asistencia: true });
  Listado.value = Listado.value.filter((e) => e.id !== item.id);
};
const quitar = (item) => {
  let index = Presentes.value.findIndex((e) => e.id === item.id);
  index !== -1 ? Presentes.value.splice(index, 1) : null;
  Listado.value.unshift({ ...item, asistencia: false });
  Presentes.value = Presentes.value.filter((e) => e.id !== item.id);
};
const guardar = async () => {
  let Array_Ausentes = Listado.value.map((e) => e.id);
  let Array_Presentes = Presentes.value.map((e) => e.id);
  let Fecha = date.value;
  let Grupo = grupo.value;
  await Asistencia_de_Hoy(Array_Presentes, Array_Ausentes, Fecha, Grupo)
    .then(() => {
      $q.notify({
        message: "Listado Guardado con exito",
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
      });
    })
    .catch((error) => {
      $q.notify({
        message: `Ha ocurrido un Error ${error}`,
        color: "red-4",
        textColor: "white",
        icon: "priority_high",
      });
    });
};
const Nuevo_Listado = async () => {
  resetear();
  date.value = hoy.value;
  Buscar();
};
const resetear = () => {
  Presentes.value.length = 0;
  Listado.value.length = 0;
};
const Filtrar = async (fecha, res) => {
  visible.value = false;
  let r = await Buscar_Grupo(fecha, res).then((e) => e);
  let Alumnos = await Mostrar_Listado().then((elem) => elem.map((e) => e.data()));
  if (r) {
    resetear();
    const { presentes, ausentes } = await Buscar_Grupo(fecha, res).then(
      (e) => e.data().Data
    );
    await presentes.map((e) =>
      Buscar_Alumno(e).then((doc) =>
        doc.id === e ? Presentes.value.push({ ...doc, asistencia: true }) : null
      )
    );
    await ausentes.map((e) =>
      Buscar_Alumno(e).then((doc) =>
        doc.id === e ? Listado.value.push({ ...doc, asistencia: false }) : null
      )
    );
    return;
  } else {
    switch (res) {
      case "Orquesta":
        resetear();
        await Alumnos.filter((elem) =>
          elem.grupo.filter((e) =>
            e === "Orquesta"
              ? Listado.value.push({ ...elem, asistencia: false }) &&
                Listado.value.reverse().sort((a, b) => a.nombre.localeCompare(b.nombre))
              : null
          )
        );
        break;
      case "Coro":
        resetear();
        (await Alumnos).filter((elem) =>
          elem.grupo.find((e) =>
            e === "Coro"
              ? Listado.value.push({ ...elem, asistencia: false }) &&
                Listado.value.reverse().sort((a, b) => a.nombre.localeCompare(b.nombre))
              : null
          )
        );
        break;
      case "Iniciacion 2":
        resetear();
        (await Alumnos).filter((elem) =>
          elem.grupo.find((e) =>
            e === "Iniciacion 2"
              ? Listado.value.push({ ...elem, asistencia: false }) &&
                Listado.value.reverse().sort((a, b) => a.nombre.localeCompare(b.nombre))
              : null
          )
        );
        break;
      case "Iniciacion 1":
        resetear();
        Listado.value.length = 0;
        (await Alumnos).filter((elem) =>
          elem.grupo.find((e) =>
            e === "Iniciacion 1"
              ? Listado.value.push({ ...elem, asistencia: false }) &&
                Listado.value.reverse().sort((a, b) => a.nombre.localeCompare(b.nombre))
              : null
          )
        );
    }
  }
};
const Buscar = async () => {
  Buscar_Por_Fecha(date.value).then((Data) => {
    Data !== null
      ? resetear() && (visible.value = false)
      : date.value === hoy.value
      ? (visible.value = false)
      : null;
  });
};
watchEffect(async () => {
  // router.push(`/${grupo.value}`);
  date.value ? Buscar() : hoy.value;
  await Filtrar(date.value, grupo.value);
});
onMounted(async () => {
  events.value = await Eventos_Calendario();
  Listado.value = Listado.value.sort((a, b) => a.nombre.localeCompare(b.nombre));
});
</script>

<style>
.scrollList {
  height: calc(100vh - (60px + 60px));
  overflow-y: scroll;
}
</style>
