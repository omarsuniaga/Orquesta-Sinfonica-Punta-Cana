<template>
  <q-layout>
    <q-page-container>
      <div class="q-my-sm col-12" style="min-width: 375px; width: 100%">
        <div class="justify-center flex">
          <div class="col-auto q-mx-sm">
            <q-btn-group>
              <q-btn color="blue-6" icon="today" @click="visible = !visible" />
              <q-btn color="blue-6" icon-right="save" @click="guardar" />
            </q-btn-group>
          </div>
          <div class="row">
            <BuscarAlumnos
              :text="text"
              class=""
              style="width: 100%"
              @onFire="eventEmittedFromChild"
            ></BuscarAlumnos>
          </div>
        </div>
        <div
          class="justify-center flex row"
          style="min-width: 375px; width: 100%"
        >
          <q-btn-toggle
            class="col-auto flex justify-around"
            rounded
            v-model="grupo"
            spread
            no-caps
            toggle-color="primary"
            color="while"
            text-color="primary"
            :options="[
              { label: 'Inicio 1', value: 'Ini1' },
              { label: 'Inicio 2', value: 'Ini2' },
              { label: 'Coro', value: 'Coro' },
              { label: 'Orquesta', value: 'Orq' },
              { label: 'Todos', value: 'All' },
            ]"
          >
          </q-btn-toggle>
        </div>
      </div>

      <div class="col-12" v-if="visible">
        <span>Selecciona una fecha</span>
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
        <q-btn
          @click="visible = !visible"
          flat
          color="primary"
          :label="date"
          size="16px"
        />
        <q-btn
          size="12px"
          color="primary"
          rounded
          @click="Nuevo_Listado()"
          v-if="date !== hoy"
          flat
        >
          Hoy
        </q-btn>
      </div>

      <div class="q-pa-xs doc-container" style="min-width: 375px; width: 100%">
        <div class="row col-12">
          <div class="col-6">
            <span class="text-body1">Ausentes</span>
            <div v-if="Loading">
              <q-spinner-cube color="indigo" />
            </div>
            <div
              v-else
              class="row flex justify-center scrollList"
              ref="chatRef"
            >
              <div
                v-if="Resultado_Busqueda.length > 0"
                style="width: 100%; max-width: 700px; min-width: 140px"
              >
                <q-card
                  class="q-ma-xs bg-red-3"
                  v-for="(item, index) in Resultado_Busqueda"
                  :key="index"
                  @click="agregar(item)"
                >
                  <q-item v-if="!item.asistencia">
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
                          <div :key="index" :class="item.class" class="q-px-xs">
                            <q-badge top color="red" :label="item" />
                          </div>
                        </q-virtual-scroll>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
              <div
                v-else
                style="width: 100%; max-width: 700px; min-width: 140px"
              >
                <q-card
                  class="q-ma-xs bg-red-3"
                  v-for="(item, index) in Listado"
                  :key="index"
                  @click="agregar(item)"
                >
                  <q-item v-if="!item.asistencia">
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
            <span class="text-body1">Presentes</span>
            <div class="row flex justify-center scrollList" ref="chatRef">
              <div style="width: 100%; max-width: 700px; min-width: 140px">
                <q-card v-if="Presentes.length === 0">
                  <q-item> No hay registros </q-item>
                </q-card>
                <q-card
                  v-else
                  class="q-ma-xs bg-green-3"
                  v-for="(item, index) in Presentes"
                  :key="index"
                  @click="quitar(item)"
                >
                  <q-item>
                    <!-- <q-item-section avatar>
                      <q-avatar>
                        <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                      </q-avatar>
                    </q-item-section> -->
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
import { useCounterStore } from "src/stores/example-store";
import { useQuasar } from "quasar";
import {
  Asistencia_de_Hoy,
  Buscar_Por_Fecha,
  Buscar_Alumno,
  Mostrar_Listado,
  Eventos_Calendario,
  // Contar_Ausentes,
} from "../firebase";
import moment from "moment";
import { ref, reactive, onMounted, watchEffect } from "vue";
import BuscarAlumnos from "src/components/Buscar-Alumnos.vue";
const $q = useQuasar();
const store = useCounterStore();
let visible = ref(false);
let Listado = ref([]);
let Presentes = ref([]);
let Alumnos = Mostrar_Listado().then((elem) => elem.map((e) => e.data()));
let Resultado_Busqueda = ref([]);
let text = ref("");
let grupo = ref("");
let Loading = ref(false);
let date = ref(moment().format("YYYY-MM-DD"));
let hoy = ref(moment().format("YYYY-MM-DD"));
let url = ref("https://placeimg.com/500/300/nature?t=" + Math.random());
let events = ref([]);
onMounted(async () => {
  events.value = await Eventos_Calendario();
});
const eventEmittedFromChild = (res) => {
  if (res.length != 0) {
    Resultado_Busqueda.value = res.map((e) => ({ ...e, avatar: url.value }));
    return Resultado_Busqueda.value;
  } else {
    Resultado_Busqueda.value.length = 0;
  }
};
const agregar = async (item) => {
  Presentes.value.find((e) =>
    e.id === item.id
      ? Presentes.value.splice(Presentes.value.indexOf(e), 1)
      : null
  );
  Listado.value.filter((e) =>
    e.id === item.id
      ? Presentes.value.push({ ...e, asistencia: true }) &&
        Presentes.value.reverse() &&
        Listado.value.splice(Listado.value.indexOf(e), 1)
      : null
  );
};
const quitar = (item) => {
  Presentes.value.filter((e) =>
    e.id === item.id
      ? Listado.value.push({ ...e, asistencia: false }) &&
        Listado.value
          .reverse()
          .sort((a, b) => a.nombre.localeCompare(b.nombre)) &&
        Presentes.value.splice(Presentes.value.indexOf(e), 1)
      : null
  );
  Listado.value = Listado.value
    .reverse()
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
};
const guardar = async () => {
  //Se almacena la fecha actual
  //El Listado.value pasa a ser los ausentes
  const Array_Ausentes = Listado.value.map((e) => e.id);
  const Array_Presentes = Presentes.value.map((e) => e.id);
  const Fecha = date.value.split("/").join("-");
  //Guardar en firebase
  await Asistencia_de_Hoy(Array_Presentes, Array_Ausentes, Fecha);
};
const Nuevo_Listado = async () => {
  resetear();
  date.value = hoy.value;
  Buscar();
};
const Procesar_Listado = async (Data) => {
  let { presentes, ausentes } = Data;
  try {
    presentes.map((e) => {
      Buscar_Alumno(e).then((doc) => {
        Presentes.value.push({ ...doc, id: doc.id, asistencia: true });
        Presentes.value
          .reverse()
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        return;
      });
    });
    ausentes.map((e) => {
      Buscar_Alumno(e).then((doc) => {
        Listado.value.push({ ...doc, id: doc.id, asistencia: false });
        Listado.value
          .reverse()
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        return;
      });
    });
  } catch (error) {
    console.log(error);
  }
};
const resetear = () => {
  Presentes.value.length = 0;
  Listado.value.length = 0;
};
const clasificacion = (opcion) => {
  Listado.value.length = 0;
  if (Presentes.value.length > 0) {
    Presentes.value.map((el) =>
      opcion.filter((e, j) => (el.id === e.id ? opcion.splice(j, 1) : null))
    );
    Listado.value.length = 0;
    Listado.value.push(
      ...opcion.sort((a, b) => a.nombre.localeCompare(b.nombre))
    );
  } else {
    Listado.value.length = 0;
    Listado.value = opcion.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }
};
const Filtrar = async (res) => {
  Alumnos = await Mostrar_Listado().then((elem) => elem.map((e) => e.data()));
  if (date.value === hoy.value) {
    switch (res) {
      case "Orq":
        //Alumnos de la Orquesta
        let Orq = await Alumnos.filter((elem) =>
          elem.grupo.find((e) => e === "Orquesta")
        );
        clasificacion(Orq);
        break;
      case "Coro":
        Listado.value.length = 0;
        let Coro = await Alumnos.filter((elem) =>
          elem.grupo.find((e) => e === "Coro")
        );
        clasificacion(Coro);
        break;
      case "Ini2":
        Listado.value.length = 0;
        let Ini2 = await Alumnos.filter((elem) =>
          elem.grupo.find((e) => e === "Iniciacion 2")
        );
        clasificacion(Ini2);
        break;
      case "Ini1":
        Listado.value.length = 0;
        let Ini1 = await Alumnos.filter((elem) =>
          elem.grupo.find((e) => e === "Iniciacion 1")
        );
        clasificacion(Ini1);
        break;
      default:
      case "All":
        clasificacion(Alumnos);
        break;
    }
  }
};
const Buscar = async () => {
  Buscar_Por_Fecha(date.value).then((Data) =>
    Data !== null
      ? Procesar_Listado(Data.Data).then(() => {
          resetear();
          visible.value = false;
          return;
        })
      : date.value === hoy.value
      ? (visible.value = false)
      : null
  );
};
watchEffect(async () => {
  date.value ? Buscar() : null;
  await Filtrar(grupo.value);
});
</script>

<style>
.scrollList {
  height: calc(100vh - (60px + 60px));
  overflow-y: scroll;
}
</style>
