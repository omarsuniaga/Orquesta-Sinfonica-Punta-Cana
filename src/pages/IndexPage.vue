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
          <q-btn-group class="col-auto flex justify-around" rounded>
            <q-btn
              flat
              color="primary"
              label="Orquesta"
              @click="Filtrar('Orq')"
            />
            <q-btn flat color="primary" label="Coro" @click="Filtrar('Coro')" />
            <q-btn
              flat
              no-wrap
              color="primary"
              label="Inicio II"
              @click="Filtrar('Ini2')"
            />
            <q-btn
              flat
              no-wrap
              color="primary"
              label="Inicio I"
              @click="Filtrar('Ini1')"
            />
          </q-btn-group>
        </div>
      </div>

      <div class="col-12" v-if="visible">
        <span>Selecciona una fecha</span>
        <div class="q-pa-sm flex justify-center scrollList">
          <div style="width: 100%; max-width: 400px; min-width: 100px">
            <div class="q-pa-md">
              <div class="q-gutter-md row items-center">
                <q-date v-model="date" minimal today-btn mask="YYYY-MM-DD" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="q-px-md flex justify-center text-md text-h6"
        v-else
        style="min-width: 375px; width: 100%"
      >
        {{ date }}
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
                        {{ $q.screen.gt.sm ? item.apellido : "" }}</q-item-label
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
                        {{ $q.screen.gt.sm ? item.apellido : "" }}</q-item-label
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
                <q-card
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
                        {{ $q.screen.gt.sm ? item.apellido : "" }}</q-item-label
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
  Buscar_Alumno_Nombre,
  // Contar_Presentes,
} from "../firebase";
import moment from "moment";
import { ref, reactive, onMounted, watchEffect } from "vue";
import BuscarAlumnos from "src/components/Buscar-Alumnos.vue";

const $q = useQuasar();
const store = useCounterStore();

let visible = ref(false);
let Listado = reactive([]);
let Presentes = reactive([]);
let Alumnos = reactive([]);
let Resultado_Busqueda = ref([]);
let text = ref("");
let Loading = ref(false);
let date = ref(moment().format("YYYY-MM-DD"));
let hoy = ref(moment().format("YYYY-MM-DD"));
let url = ref("https://placeimg.com/500/300/nature?t=" + Math.random());

onMounted(async () => {
  Nuevo_Listado();
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
  Listado.filter((e) =>
    e.id === item.id
      ? Presentes.push({ ...e, asistencia: true }) &&
        Presentes.reverse() &&
        Listado.splice(Listado.indexOf(e), 1)
      : null
  );
};
const quitar = (item) => {
  Presentes.filter((e) =>
    e.id === item.id
      ? Listado.push({ ...e, asistencia: false }) &&
        Listado.reverse().sort((a, b) => a.nombre.localeCompare(b.nombre)) &&
        Presentes.splice(Presentes.indexOf(e), 1)
      : null
  );
  Listado = Listado.reverse().sort((a, b) => a.nombre.localeCompare(b.nombre));
};
const guardar = async () => {
  //Se almacena la fecha actual
  //El listado pasa a ser los ausentes
  const Array_Ausentes = Listado.map((e) => e.id);
  const Array_Presentes = Presentes.map((e) => e.id);
  const Fecha = date.value.split("/").join("-");
  //Guardar en firebase
  await Asistencia_de_Hoy(Array_Presentes, Array_Ausentes, Fecha);
};
const Nuevo_Listado = async () => {
  //extraer de firebase todos los alumnos inscritos
  Alumnos = await Mostrar_Listado();
  Alumnos.map((e) => {
    Listado.push({ ...e.data(), asistencia: false });
  });
};
//Recibe la data, y busca el alumno segun su id y lo muestra en el listado
const Procesar_Listado = async (Data) => {
  let { presentes, ausentes } = Data;
  try {
    presentes.map((e) => {
      Buscar_Alumno(e).then((doc) => {
        Presentes.push({ ...doc, id: doc.id, asistencia: true });
        Presentes.reverse().sort((a, b) => a.nombre.localeCompare(b.nombre));
        return;
      });
    });
    ausentes.map((e) => {
      Buscar_Alumno(e).then((doc) => {
        Listado.push({ ...doc, id: doc.id, asistencia: false });
        Listado.reverse().sort((a, b) => a.nombre.localeCompare(b.nombre));
        return;
      });
    });
  } catch (error) {
    console.log(error);
  }
};
//Limpia el Lienzo de la pantalla
const resetear = () => {
  Presentes.length = 0;
  Listado.length = 0;
};

watchEffect(async () => {
  if (date.value !== hoy.value) {
    Buscar_Por_Fecha(date.value).then((Data) =>
      Data !== null
        ? Procesar_Listado(Data.Data).then(() => {
            resetear();
            visible.value = false;
            return;
          })
        : null
    );
  }
});

const Filtrar = async (res) => {
  Alumnos = await Mostrar_Listado().then((elem) => elem.map((e) => e.data()));
  switch (res) {
    case "Orq":
      let Orq = Alumnos.filter((elem) =>
        elem.grupo.find((e) => e === "Orquesta")
      );
      Listado.length = 0;
      Listado.push(...Orq);
      break;
    case "Coro":
      let Coro = Alumnos.filter((elem) => elem.grupo.find((e) => e === "Coro"));
      Listado.length = 0;
      Listado.push(...Coro);
      break;
    case "Ini2":
      let Ini2 = Alumnos.filter((elem) =>
        elem.grupo.find((e) => e === "Iniciacion 2")
      );
      Listado.length = 0;
      Listado.push(...Ini2);
      break;
    case "Ini1":
      let Ini1 = Alumnos.filter((elem) =>
        elem.grupo.find((e) => e === "Iniciacion 1")
      );
      Listado.length = 0;
      Listado.push(...Ini1);
      break;
    default:
    // Nuevo_Listado();
  }
};
</script>

<style>
.scrollList {
  height: calc(100vh - (60px + 60px));
  overflow-y: scroll;
}
</style>
