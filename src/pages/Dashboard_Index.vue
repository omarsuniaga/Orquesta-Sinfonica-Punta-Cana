<template>
  <div class="q-pa-md">
    <BuscarAlumnos
      :text="text"
      style="width: 100%"
      @onFire="eventEmittedFromChild"
    ></BuscarAlumnos>
    <q-toolbar class="q-ma-sm">
      <div
        v-if="Resultado_Busqueda.length > 0"
        style="width: 100%; max-width: 700px; min-width: 140px"
      >
        <div class="row flex justify-center scrollList" ref="chatRef">
          <div style="width: 100%; max-width: 700px; min-width: 140px">
            <q-card
              class="q-ma-xs bg-gray-3"
              v-for="(item, index) in Resultado_Busqueda"
              :key="index"
              @click="detalle(item.id)"
            >
              <q-item v-if="!item.asistencia" :id="item.id">
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
        </div>
      </div>
      <q-space></q-space>
    </q-toolbar>
    <q-toolbar>
      <h6 class="text-weight-bolder">Dashboard</h6>
      <q-space />
      <q-icon name="fas fa-calendar-minus" size="" class="q-mr-sm" />
      <div class="text-overline">{{ Fecha }}</div>
    </q-toolbar>
    <div class="col-auto">
      <q-card class="q-mx-md q-pa-md" bordered>
        <div class="text-overline">Alumnos</div>
        <div class="flex flex-center row">
          <div class="text-h4 text-weight-bolder q-mr-md">
            {{ TotalAlumnos }}
          </div>
          <q-chip color="red-1" text-color="red-3" icon="fas fa-chevron-down"
            >20%</q-chip
          >
          <div>
            <div class="flex flex-center column"></div>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-auto">
      <q-card class="q-mx-md q-pa-md">
        <div class="text-overline">Horarios</div>
        <div class="flex justify-between no-wrap items-center">
          <q-tree
            :nodes="simple"
            dense
            node-key="label"
            v-model:expanded="expanded"
          />
        </div>
      </q-card>
    </div>
    <div class="col-auto">
      <q-card class="q-ma-md q-pa-md" bordered>
        <div class="text-overline">La Orquesta</div>
        <div class="flex justify-between items-center">
          <VueApexCharts
            type="donut"
            :options="pie.chartOptions"
            :series="pie.series"
          ></VueApexCharts>
          <VueApexCharts
            type="pie"
            :options="generos.chartOptions"
            :series="generos.series"
          ></VueApexCharts>
        </div>
      </q-card>
    </div>
    <div class="col-auto">
      <q-card class="q-ma-md q-pa-md" bordered>
        <HistorialAsistencias />
      </q-card>
    </div>
  </div>
  <q-toolbar>
    <div class="text-overline">Eventos</div>
    <q-space></q-space>

    <div class="text-overline">Horarios</div>
    <div class="text-caption text-green q-ml-md">All patients</div>
    <q-icon name="fas fa-chevron-right" size="10px" class="" color="green-7" />
  </q-toolbar>
  <div class="row q-col-gutter-md">
    <div class="col-6">
      <q-card class="card1 q-mx-md q-pa-sm" bordered>
        <div class="row q-col-gutter-md">
          <div class="col-6">
            <div class="text-caption">Concierto 14 de Oct</div>
            <div class="text-caption text-grey-5">4:30pm - 7:30pm</div>
            <div>Hotel Barcelo</div>
          </div>
          <div class="col-6">
            <div class="flex justify-end row">Autobus</div>
          </div>
        </div>
      </q-card>
    </div>
    <div class="col-6">
      <q-card class="q-mx-md q-pa-sm" bordered>
        <div class="row q-col-gutter-md">
          <div class="col-3">aaa</div>
          <div class="col-9">bbb</div>
        </div>
        <div class="row q-col-gutter-md q-mt-md"></div>
      </q-card>
    </div>
  </div>
  <RightSideBar />
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Leer_Alumnos,
  Grupo_Porcentaje_Fechas,
  Clasificacion_Generos,
} from "../firebase";

import RightSideBar from "src/components/RightSideBar.vue";
import moment from "moment";
import VueApexCharts from "vue3-apexcharts";
import { useQuasar } from "quasar";
import HistorialAsistencias from "src/components/Historial-Asistencias.vue";
import BuscarAlumnos from "src/components/Buscar-Alumnos.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps({
  text: String,
});
let detalle = (id) => {
  return router.push(`/Detalles_Alumnos/${id}`);
};
let Resultado_Busqueda = ref([]);
const eventEmittedFromChild = (res) => {
  if (res.length != 0) {
    Resultado_Busqueda.value = res.map((e) => ({ ...e }));
    return Resultado_Busqueda.value;
  } else {
    Resultado_Busqueda.value.length = 0;
  }
};
let TotalAlumnos = ref(0);
let Alumnos = ref(0);
const $q = useQuasar();
// const darka = true;
// $q.dark.set(darka);
const expanded = ref(["Evolucion del Alumno", "Repertorio"]);
let simple = [
  {
    label: "Dias de Ensayos",
    children: [
      {
        label: "Lunes",
        children: [
          {
            label: "3:30pm-4:30pm",
            children: [
              {
                label: "Iniciacion 1",
              },
              {
                label: "Iniciacion 2",
              },
              {
                label: "Taller De Chelos",
              },
            ],
          },
          {
            label: "4:30pm-5:30pm",
            children: [
              {
                label: "Taller de Violin",
              },
              {
                label: "Taller de Violas",
              },
              {
                label: "Coro",
              },
            ],
          },
          {
            label: "5:30pm-6:30pm",
            children: [
              {
                label: "Taller de Violin",
              },
            ],
          },
        ],
      },
      {
        label: "Miercoles",
        children: [
          {
            label: "3:30pm-4:30pm",
            children: [
              {
                label: "Iniciacion 2",
              },
            ],
          },
          {
            label: "4:30pm-5:30pm",
            children: [
              {
                label: "Taller de Cuerdas Supervisados",
              },
            ],
          },
          {
            label: "5:30pm-6:30pm",
            children: [
              {
                label: "Coro",
              },
            ],
          },
        ],
      },
      {
        label: "Jueves",
        children: [
          {
            label: "3:30pm-4:30pm",
            children: [
              {
                label: "Iniciacion de Cuerdas Grupo 1",
              },
            ],
          },
          {
            label: "4:30pm-5:30pm",
            children: [
              {
                label: "Iniciacion de Cuerdas Grupo 2",
              },
            ],
          },
          {
            label: "5:30pm-6:30pm",
            children: [
              {
                label: "Ensayo General de Orquesta",
              },
            ],
          },
        ],
      },
      {
        label: "Sabados",
        children: [
          {
            label: "10:00am-1:00pm",
            children: [
              {
                label: "Ensayo General de Orquesta",
              },
            ],
          },
        ],
      },
    ],
  },
];
let horarios = ref({
  dias: [
    {
      lunes: [
        {
          id: 1,
          clase: "Iniciacion 1",
          horario: "3:30pm - 4:30pm",
          profe: "Omar Suniaga",
        },
        {
          id: 2,
          clase: "Inicacion 2",
          horario: "3:30pm - 4:30pm",
          profe: "Jose M. Tavera",
        },
        {
          id: 3,
          clase: "Taller de Chelos",
          horario: "3:30pm - 4:30pm",
          profe: "Nathalie Mora",
        },
        {
          id: 4,
          clase: "Taller de Violin",
          horario: "4:30pm - 5:30pm",
          profe: "Jose M. Tavera",
        },
        {
          id: 5,
          clase: "Taller de Violas",
          horario: "4:30pm - 5:30pm",
          profe: "Omar Suniaga",
        },
        {
          id: 6,
          clase: "Coro",
          horario: "4:30pm - 5:30pm",
          profe: "Nathalie Mora",
        },
        {
          id: 7,
          clase: "Ensayo General de Orquesta",
          horario: "5:30pm - 6:30pm",
          profe: "Omar Suniaga",
        },
      ],
      Miercoles: [
        {
          id: 1,
          clase: "Iniciacion 2",
          horario: "3:30pm - 4:30pm",
          profe: "Omar Suniaga",
        },
        {
          id: 2,
          clase: "Coro",
          horario: "4:30pm - 5:30pm",
          profe: "Omar Suniaga",
        },
        {
          id: 3,
          clase: "Talleres de Cuerdas (Supervisados)",
          horario: "5:30pm - 6:30pm",
          profe: "Omar Suniaga",
        },
      ],
      Jueves: [
        {
          id: 1,
          clase: "Inicacion de Cuerdas grupo 1",
          horario: "3:30pm - 4:30pm",
          profe: "Omar Suniaga",
        },
        {
          id: 2,
          clase: "Inicacion de Cuerdas grupo 2",
          horario: "4:30pm - 5:30pm",
          profe: "Omar Suniaga",
        },
        {
          id: 3,
          clase: "Ensayo General de Orquesta ",
          horario: "5:30pm - 6:30pm",
          profe: "Omar Suniaga",
        },
      ],
      Sabados: [
        {
          id: 1,
          clase: "Ensayo General Orquesta",
          horario: "10:00am - 1:00pm",
          profe: "Omar Suniaga",
        },
      ],
    },
  ],
});

let generos = ref({
  series: [],
  chartOptions: {
    chart: {
      width: 580,
      type: "pie",
    },
    labels: ["Masculinos", "Femeninas"],
    responsive: [
      {
        breakpoint: 720,
        options: {
          chart: {
            width: 260,
          },
          legend: {
            position: "top",
          },
        },
      },
    ],
  },
});
const pie = {
  series: [4, 4, 4, 7, 3],
  chartOptions: {
    labels: ["Violin 1", "Violin 2", "Violin 3", "Violas", "Chelos"],
    responsive: [
      {
        breakpoint: 720,
        options: {
          chart: {
            width: 260,
          },
          legend: {
            position: "top",
          },
        },
      },
    ],
  },
};
Leer_Alumnos().then(
  (e) => (TotalAlumnos.value = e.size) && (Alumnos.value = e.docs)
);
// Grupo_Porcentaje_Fechas("Orquesta").then((elem) => {
//   presentes.value.push(elem.map((el) => el.presentes));
//   ausentes.value.push(elem.map((el) => el.ausentes));
//   suma.value.push(elem.map((el) => el.presentes + el.ausentes));
//   return;
// });
// linea.value.series.filter((elem) => {
//   elem.name === "Presentes" ? (elem.data = presentes.value) : null;
//   elem.name === "Ausentes" ? (elem.data = ausentes.value) : null;
//   elem.name === "Suma" ? (elem.data = suma.value) : null;
//   return;
// });

// linea.value.series.push({
//   name: "asd",
//   data: elem.map((el) => Math.ceil(el.porcentaje)),
// }) &&
//   linea.value.chartOptions.xaxis.categories.push(elem.map((el) => el.fecha));
let Fecha = moment().format("LLLL");
let slide = ref("style");
let lorem = "Lorem ipsum dolor; sit amet consectetur adipi.";
let selection = ref(["green"]);
let text = "";
let dense = false;
let value = "20";
onMounted(async () => {
  let femeninas = (await Clasificacion_Generos()).femenino;
  let masculinos = (await Clasificacion_Generos()).masculino;
  generos.value.series.push(masculinos, femeninas);
});
</script>
<style scoped>
.search {
  width: 700px;
}
.doctors {
  height: 220px;
}
.overlapping {
  border: 2px solid white;
  position: absolute;
  margin-left: -20px;
}
.card1 {
  height: 100px;
}
.top {
  margin-top: -40px;
}
.colorCard {
  background: #f8f8f8;
}
</style>
