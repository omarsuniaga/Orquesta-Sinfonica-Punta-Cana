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
      <div class="text-overline">Los 5 Alumnos mas inasistentes del mes</div>
      <q-card class="q-mx-md q-pa-md" bordered>
        <q-card-section>
          <div class="cols">
            <q-item
              clickable
              v-ripple
              v-for="lista of ObjetoGlobal.topInasistencias"
              :key="lista.id"
              class="'bg-red-4'"
              @click="$router.push('/Detalles_Alumnos/' + lista.id)"
            >
              <q-item-section>
                <q-item-label lines="1" class="text-red-3">
                  {{ lista.nombre }}
                  <q-badge rounded color="red" :label="lista.inasistencias">
                  </q-badge>
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <!-- <div class="col-auto">
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
    </div> -->
    <div class="col-auto">
      <q-card class="q-ma-md q-pa-md" bordered>
        <div class="text-overline">
          Cantidad de Alumnos en la Orquesta {{ TotalAlumnos_Orquesta.length }}
        </div>
        <div class="text-overline">
          Cantidad de Alumnos en el Coro {{ TotalAlumnos_Coro.length }}
        </div>
        <div class="text-overline">
          Cantidad de Alumnos en el Solfeo {{ TotalAlumnos_Solfeo.length }}
        </div>
        <div class="flex justify-between items-center">
          <VueApexCharts
            type="polarArea"
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
            <div class="text-caption">Cantidad del coro</div>
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
import { ref, onMounted, provide } from "vue";
import {
  Leer_Alumnos,
  Grupo_Porcentaje_Fechas,
  Clasificacion_Generos,
  Total_Orquesta,
  Total_Coro,
  Total_Solfeo,
} from "../firebase";

import RightSideBar from "src/components/RightSideBar.vue";
import moment from "moment";
import VueApexCharts from "vue3-apexcharts";
import { useQuasar } from "quasar";
import HistorialAsistencias from "src/components/Historial-Asistencias.vue";
import BuscarAlumnos from "src/components/Buscar-Alumnos.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const ObjetoGlobal = ref([]);
let Resultado_Busqueda = ref([]);
let TotalAlumnos_Orquesta = ref(0);
let TotalAlumnos_Coro = ref(0);
let TotalAlumnos_Solfeo = ref(0);
const $q = useQuasar();
let detalle = (id) => {
  return router.push(`/Detalles_Alumnos/${id}`);
};
const props = defineProps({
  text: String,
});
const eventEmittedFromChild = (res) => {
  if (res.length != 0) {
    Resultado_Busqueda.value = res.map((e) => ({ ...e }));
    return Resultado_Busqueda.value;
  } else {
    Resultado_Busqueda.value.length = 0;
  }
};
//crear una variable global para usarlo en el dashboar

provide(/* key */ "ObjetoGlobal", /* value */ ObjetoGlobal.value);

console.log(ObjetoGlobal.value);
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
        breakpoint: 280,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  },
});
const pie = ref({
  series: [],
  chartOptions: {
    chart: {
      type: "polarArea",
      width: 580,
    },
    labels: [],
    responsive: [
      {
        breakpoint: 280,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  },
});

let Fecha = moment().format("LLLL");
let text = "";
onMounted(async () => {
  TotalAlumnos_Coro.value = await Total_Coro();
  TotalAlumnos_Orquesta.value = await Total_Orquesta();
  TotalAlumnos_Solfeo.value = await Total_Solfeo();
  let femeninas = (await Clasificacion_Generos()).femenino;
  let masculinos = (await Clasificacion_Generos()).masculino;
  generos.value.series.push(masculinos, femeninas);

  let instrumentos = TotalAlumnos_Orquesta.value
    .map((e) => e.instrumento)
    .sort((a, b) => a - b)
    .reduce((prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev), {});

  for (let clave in instrumentos) {
    pie.value.series.push(instrumentos[clave]);
    pie.value.chartOptions.labels.push(clave);
  }
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
