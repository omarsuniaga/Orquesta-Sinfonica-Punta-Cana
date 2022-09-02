<template>
  <q-layout>
    <q-page-container>
      <div class="q-pa-md">
        <div class="row justify-end flex">
          <!-- <h4>{{ store.$state.sesion }}</h4> -->
          <q-btn-group rounded col-12 justify-end flex>
            <q-btn
              flat
              style="color: #ff0080"
              label="Orquesta"
              @click="Filtrar('Orq')"
            />
            <q-btn
              flat
              style="color: #ff0080"
              label="Coro"
              @click="Filtrar('Coro')"
            />
            <q-btn
              flat
              style="color: #ff0080"
              label="Iniciacion II"
              @click="Filtrar('Ini2')"
            />
            <q-btn
              flat
              style="color: #ff0080"
              label="Iniciacion I"
              @click="Filtrar('Ini1')"
            />
            <q-btn
              color="purple"
              rounded
              icon="today"
              @click="visible = !visible"
            />
            <q-btn
              color="purple"
              rounded
              icon-right="save"
              label="Guardar"
              @click="guardar"
            />
          </q-btn-group>
        </div>
      </div>

      <div class="col" v-if="visible">
        <h6>Calendario</h6>
        <div class="q-pa-sm row justify-center scrollList">
          <div style="width: 100%; max-width: 300px; min-width: 100px">
            <div class="q-pa-md">
              <div class="q-gutter-md row items-start">
                <q-date v-model="date" minimal />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="q-px-md flex justify-center text-md text-h6" v-else>
        {{ date }}
      </div>

      <div class="q-pa-lg doc-container">
        <div class="row">
          <div class="col-6">
            <span class="text-body1">Ausentes</span>
            <div v-if="Loading">
              <q-spinner-cube color="indigo" />
            </div>
            <div
              v-else
              class="q-pa-md row flex justify-center scrollList"
              ref="chatRef"
            >
              <div style="width: 100%; max-width: 700px; min-width: 100px">
                <q-card
                  class="q-ma-sm bg-red-3"
                  v-for="(item, index) in Listado"
                  :key="index"
                  @click="agregar(item)"
                >
                  <q-item v-if="!item.asistencia">
                    <!-- <q-item-section avatar>
                      <q-avatar>
                        <q-img
                          :src="url"
                          style="height: 140px; max-width: 150px"
                        >
                          <template v-slot:loading>
                            <q-spinner-gears color="white" />
                          </template>
                        </q-img>
                      </q-avatar>
                    </q-item-section> -->
                    <q-item-section class="col-6">
                      <q-item-label class="text-weight-regular"
                        >{{ item.nombre }} {{ item.apellido }}</q-item-label
                      >
                      <q-item-label caption
                        >{{
                          item.instrumento === "N/A"
                            ? item.grupo + " - "
                            : item.instrumento + " - "
                        }}

                        {{ item.edad }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card>
              </div>
            </div>
          </div>
          <div class="col-6">
            <span class="text-body1">Presentes</span>
            <div
              class="q-pa-md row flex justify-center scrollList"
              ref="chatRef"
            >
              <div style="width: 100%; max-width: 700px; min-width: 100px">
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
                    <q-item-section>
                      <q-item-label class="text-weight-regular"
                        >{{ item.nombre }} {{ item.apellido }}</q-item-label
                      >
                      <q-item-label caption
                        >{{
                          item.instrumento === "N/A"
                            ? item.grupo + " - "
                            : item.instrumento + " - "
                        }}

                        {{ item.edad }}
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
  Leer_Alumnos,
  Asistencia_de_Hoy,
  db,
  Busqueda_Por_Fecha,
  Buscar_Alumno,
  Mostrar_Listado,
  // Contar_Presentes,
} from "../firebase";
import moment from "moment";
// import { date as dateFilter } from "quasar";
import { ref, reactive, onMounted, watchEffect } from "vue";

const $q = useQuasar();

const store = useCounterStore();
let visible = ref(false);
let Listado = reactive([]);
let Presentes = reactive([]);
let Loading = ref(false);
let Alumnos = reactive([]);
let date = ref(moment().format("YYYY/MM/DD"));
const url = ref("https://placeimg.com/500/300/nature?t=" + Math.random());

onMounted(() => {
  Alumnos = Mostrar_Listado().then((elem) => elem.map((e) => e.data()));
});

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
  Alumnos.forEach((e) => {
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
  Listado.length = 0;
  Presentes.length = 0;
};
watchEffect(() => {
  //Observa cada cambio en la fecha y busca los alumnos que asistieron a la fecha
  Busqueda_Por_Fecha(date.value.split("/").join("-"))
    .then((Data) => {
      if (Data) {
        resetear();
        Procesar_Listado(Data.Data).then();
      } else {
        resetear();
        Nuevo_Listado().then((Loading.value = false));
      }
    })
    .then(() => (visible.value = false))
    .catch((error) => {
      console.log(error);
    });
});

const Filtrar = async (res) => {
  Alumnos = await Mostrar_Listado().then((elem) => elem.map((e) => e.data()));
  switch (res) {
    case "Orq":
      let Orq = Alumnos.filter((e) => e.grupo === "Orquesta");
      resetear();
      Listado.push(...Orq);
      break;
    case "Coro":
      let Coro = Alumnos.filter((e) => e.grupo === "Coro");
      resetear();
      Listado.push(...Coro);
      break;
    case "Ini2":
      let Ini2 = Alumnos.filter((e) => e.grupo === "Iniciacion 2");
      resetear();
      Listado.push(...Ini2);
      break;
    case "Ini1":
      let Ini1 = Alumnos.filter((e) => e.grupo === "Iniciacion 1");
      resetear();
      Listado.push(...Ini1);
      break;
    default:
      Nuevo_Listado();
  }
};
</script>

<style>
.scrollList {
  height: calc(100vh - (60px + 60px));
  overflow-y: scroll;
}
</style>
