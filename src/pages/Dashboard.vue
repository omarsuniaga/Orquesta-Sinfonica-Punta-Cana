<template>
  <div class="q-pa-md">
    <q-toolbar class="q-ma-sm">
      <q-input
        outlined
        v-model="text"
        label="Search"
        :dense="dense"
        rounded
        class="search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-space></q-space>
      <q-btn color="white" text-color="black" icon="fas fa-moon"></q-btn>
    </q-toolbar>
    <q-toolbar>
      <h6 class="text-weight-bolder">Dashboard</h6>
      <q-space />
      <q-icon name="fas fa-calendar-minus" size="" class="q-mr-sm" />
      <div class="text-overline">{{ Fecha }}</div>
    </q-toolbar>
    <div class="row top flex flex-center">
      <div class="col-auto">
        <q-card class="q-ma-md q-pa-md" bordered>
          <div class="text-overline">La Orquesta</div>
          <div class="flex flex-center column">
            <VueApexCharts
              type="pie"
              :options="pie.chartOptions"
              :series="pie.series"
            ></VueApexCharts>
          </div>
        </q-card>
      </div>
      <div class="col-auto">
        <q-card class="q-ma-md q-pa-md" bordered>
          <div class="text-overline">La Orquesta</div>
          <div class="flex flex-center column">
            <VueApexCharts
              type="bar"
              :options="linea.chartOptions"
              :series="linea.series"
            ></VueApexCharts>
          </div>
        </q-card>
      </div>
      <div class="flex justify-between no-wrap">
        <q-card class="q-mx-md q-pa-md">
          <div class="text-overline">Total Alumnos</div>
          <div class="flex flex-center row">
            <div class="text-h4 text-weight-bolder q-mr-md">
              {{ TotalAlumnos }}
            </div>
            <q-chip
              color="green-1"
              text-color="green-3"
              icon="fas fa-chevron-up"
              >% que asisten</q-chip
            >
          </div>
        </q-card>
        <q-card class="q-mx-md q-pa-md">
          <div class="text-overline">Alumnos Irregulares</div>
          <div class="flex flex-center row">
            <div class="text-h4 text-weight-bolder q-mr-md">32</div>
            <q-chip color="red-1" text-color="red-3" icon="fas fa-chevron-down"
              >02%</q-chip
            >
          </div>
        </q-card>
      </div>
    </div>
    <q-toolbar>
      <div class="text-overline">Events</div>
      <q-space></q-space>

      <div class="text-overline">Your patients today</div>
      <div class="text-caption text-green q-ml-md">All patients</div>
      <q-icon
        name="fas fa-chevron-right"
        size="10px"
        class=""
        color="green-7"
      />
    </q-toolbar>
    <div class="row q-col-gutter-md">
      <div class="col-6">
        <q-card class="card1 q-mx-md q-pa-sm" bordered>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-caption">Team meeting</div>
              <div class="text-caption text-grey-5">13:30 - 14:30</div>
              <div>
                <q-avatar
                  v-for="n in 5"
                  :key="n"
                  size="40px"
                  class="overlapping"
                  :style="`left: ${n * 25}px`"
                >
                  <img :src="`https://cdn.quasar.dev/img/avatar${n + 1}.jpg`" />
                </q-avatar>
              </div>
            </div>
            <div class="col-6">
              <div class="flex justify-end row">
                <q-toggle color="green" v-model="selection" val="green" />
              </div>
              <div class="flex justify-end row">
                <q-btn
                  round
                  icon="fas fa-pencil-alt"
                  size="10px"
                  color="black"
                  class="q-mr-sm"
                ></q-btn>
                <q-btn
                  round
                  icon="fas fa-chevron-right"
                  size="10px"
                  color="green"
                ></q-btn>
              </div>
            </div>
          </div>
        </q-card>
        <q-card class="card1 q-mx-md q-pa-sm q-mt-sm" bordered>
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-caption">Nobel prize</div>
              <div class="text-caption text-grey-5">13:30 - 14:30</div>
              <div>
                <q-avatar
                  v-for="n in 5"
                  :key="n"
                  size="40px"
                  class="overlapping"
                  :style="`left: ${n * 25}px`"
                >
                  <img :src="`https://cdn.quasar.dev/img/avatar${n + 1}.jpg`" />
                </q-avatar>
              </div>
            </div>
            <div class="col-6">
              <div class="flex justify-end row">
                <q-toggle color="gre" v-model="selection" val="" />
              </div>
              <div class="flex justify-end row">
                <q-btn
                  round
                  icon="fas fa-pencil-alt"
                  size="10px"
                  color="black"
                  class="q-mr-sm"
                ></q-btn>
                <q-btn
                  round
                  icon="fas fa-chevron-right"
                  size="10px"
                  color="green"
                ></q-btn>
              </div>
            </div>
          </div>
        </q-card>
      </div>
      <div class="col-6">
        <q-card class="q-mx-md q-pa-sm" bordered>
          <div class="row q-col-gutter-md">
            <div class="col-3">
              <div class="text-caption text-weight-bolder q-mt-lg">
                10:00 am
              </div>
            </div>
            <div class="col-9">
              <q-card class="q-px-sm colorCard" bordered flat>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>Sarah Hosten</q-item-label>
                    <q-item-label caption>Diagnosis: Stroke</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="fas fa-ellipsis-v" color="" />
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-3">
              <div class="text-caption text-weight-bolder q-mt-lg">
                10:00 am
              </div>
            </div>
            <div class="col-9">
              <q-card class="q-px-sm colorCard" bordered flat>
                <q-item>
                  <q-item-section avatar>
                    <q-avatar>
                      <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon name="fas fa-ellipsis-v" color="" />
                  </q-item-section>
                </q-item>
              </q-card>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </div>
  <RightSideBar />
</template>

<script setup>
import { ref } from "vue";
import { Leer_Alumnos, Grupo_Porcentaje_Fechas } from "../firebase";
import RightSideBar from "src/components/RightSideBar.vue";
import moment from "moment";
import VueApexCharts from "vue3-apexcharts";
import { useQuasar } from "quasar";
const props = defineProps({
  text: String,
});

let TotalAlumnos = ref(0);
let Alumnos = ref(0);
const $q = useQuasar();
const darka = true;
$q.dark.set(darka);
let ausentes = ref([]);
let presentes = ref([]);
let suma = ref([]);
const pie = {
  series: [4, 4, 4, 7, 3],
  chartOptions: {
    chart: {
      width: 580,
      type: "pie",
    },
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
const linea = ref({
  series: [
    {
      name: "Ausentes",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Presentes",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: "Suma",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ],
  chartOptions: {
    chart: {
      height: 450,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "% Asistencias de la Orquesta",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [],
    },
  },
});
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
