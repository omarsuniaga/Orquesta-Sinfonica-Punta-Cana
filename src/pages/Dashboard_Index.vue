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
    </q-toolbar>
    <q-toolbar>
      <q-btn-toggle
        v-model="model"
        push
        rounded
        glossy
        toggle-color="purple"
        :options="[
          { value: 'hoy', slot: 'hoy' },
          { value: 'semanal', slot: 'semanal' },
          { value: 'mensual', slot: 'mensual' },
        ]"
      >
        <template v-slot:hoy>
          <div class="row items-center no-wrap">
            <div class="text-center">Hoy</div>
            <q-icon right name="today" />
          </div>
        </template>

        <template v-slot:semanal>
          <div class="row items-center no-wrap">
            <div class="text-center">3 Semanas</div>
            <q-icon right name="calendar_view_month" />
          </div>
        </template>

        <template v-slot:mensual>
          <div class="row items-center no-wrap">
            <div class="text-center">3 Meses</div>
            <q-icon right name="calendar_month" />
          </div>
        </template>
      </q-btn-toggle>
    </q-toolbar>

    <div class="text-overline">Los 5 Alumnos mas asistencias del mes</div>
    <q-card class="q-mx-md q-pa-md" bordered>
      <q-card-section>
        <div class="cols">
          <q-item
            clickable
            v-ripple
            v-for="lista of ObjetoGlobal"
            :key="lista.id"
            class="'bg-red-4'"
            @click="$router.push('/Detalles_Alumnos/' + lista.id)"
          >
            <q-item-section>
              <q-item-label lines="1" class="text-red-3">
                {{ lista[0] }}
                <q-badge rounded color="red" :label="lista[1]"> </q-badge>
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
  <q-toolbar>
    <div class="flex justify-between q-pa-xs">
      <q-card flat bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Orquesta</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ TotalAlumnos_Orquesta.length }} Alumnos
        </q-card-section>
      </q-card>
      <q-card flat bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Coro</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ TotalAlumnos_Coro.length }} Alumnos</q-card-section
        >
      </q-card>
      <q-card flat bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Solfeo</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ TotalAlumnos_Solfeo.length }} Alumnos</q-card-section
        >
      </q-card>
      <q-card flat bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Esperando</div>
        </q-card-section>
        <q-card-section class="q-pt-none"> 30 Alumnos</q-card-section>
      </q-card>
    </div>
  </q-toolbar>
  <div class="col-auto">
    <q-card class="q-ma-md q-pa-md" bordered>
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
import { ref, onMounted, provide, watchEffect } from "vue";
import {
  Clasificacion_Generos,
  Total_Orquesta,
  Total_Coro,
  Total_Solfeo,
  Mostrar_todo,
  Mostrar_Listado,
} from "../firebase";

import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import RightSideBar from "src/components/RightSideBar.vue";
import moment from "moment";
import VueApexCharts from "vue3-apexcharts";
import HistorialAsistencias from "src/components/Historial-Asistencias.vue";
import BuscarAlumnos from "src/components/Buscar-Alumnos.vue";
//Variables
const router = useRouter();
const ObjetoGlobal = ref([]);
const $q = useQuasar();
let Resultado_Busqueda = ref([]);
let TotalAlumnos_Orquesta = ref(0);
let TotalAlumnos_Coro = ref(0);
let TotalAlumnos_Solfeo = ref(0);
let model = ref("hoy");
let _l = ref([]);
let Alumnos = ref([]);
let Fecha = moment().format("LLLL");
let text = "";
let attendance = ref();

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

async function Generar_Asistencias_Global() {
  let Obj = [];
  let nom = "";

  //Busca al alumnos segun su id
  const Buscar = (id) => {
    Alumnos.value.filter((elem) =>
      elem.id === id ? (nom = elem.nombre + " " + elem.apellido) : null
    );
    return nom;
  };

  //Itera las fechas que existen
  _l.value.filter((elem) => {
    if (!!elem.Fecha) {
      let { presentes } = elem.Data;
      let { ausentes } = elem.Data;
      //Selecciona aquellos items donde id este en presente
      presentes.map((el) =>
        Obj.push({ name: Buscar(el), date: elem.Fecha, attended: true })
      );
      //Selecciona aquellos items donde id este en presente
      ausentes.map((el) =>
        Obj.push({ name: Buscar(el), date: elem.Fecha, attended: false })
      );
      return { presentes, ausentes };
    }
    return (attendance.value = Obj);
  });
  return Obj;
}

const Semanal = () => {
  let Semanas = attendance.value
    .filter(({ date, attended }) => {
      const attendenceDate = new Date(date);
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
      return attended && attendenceDate > threeWeeksAgo;
    })
    .reduce((attendees, { name }) => {
      attendees[name] = (attendees[name] || 0) + 1;
      return attendees;
    }, {});
  //convertir el Objeto Semanas.value en un array
  let SemanasArray = ref([]);
  SemanasArray.value = Object.entries(Semanas);
  ObjetoGlobal.value = SemanasArray.value.sort((a, b) => b[1] - a[1]);
  const topFiveEntries = ObjetoGlobal.value.slice(0, 5);
  const topFiveKeys = topFiveEntries.map((entry) => entry);
  ObjetoGlobal.value = topFiveKeys;

  return ObjetoGlobal.value;
};

const Mensual = () => {
  let meses = attendance.value
    .filter(({ date, attended }) => {
      const attendenceDate = new Date(date);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return attended && attendenceDate > threeMonthsAgo;
    })
    .reduce((attendees, { name }) => {
      attendees[name] = (attendees[name] || 0) + 1;
      return attendees;
    }, {});
  let MesArray = ref([]);
  MesArray.value = Object.entries(meses);
  ObjetoGlobal.value = MesArray.value.sort((a, b) => b[1] - a[1]);
  const topFiveEntries = ObjetoGlobal.value.slice(0, 5);
  const topFiveKeys = topFiveEntries.map((entry) => entry);
  ObjetoGlobal.value = topFiveKeys;

  return ObjetoGlobal.value;
};

//Esta funcion intenta almacenar en un objeto a los alumnos fecha y asistencia
onMounted(async () => {
  //Obtener el total de alumnos segun el grupo
  TotalAlumnos_Coro.value = await Total_Coro();
  TotalAlumnos_Orquesta.value = await Total_Orquesta();
  TotalAlumnos_Solfeo.value = await Total_Solfeo();

  //Clasificacion por generos de alumnos
  let femeninas = (await Clasificacion_Generos()).femenino;
  let masculinos = (await Clasificacion_Generos()).masculino;

  //Graficar los valores de Femeninos y Masculinos
  generos.value.series.push(masculinos, femeninas);

  //Obtetner listados de instrumentos
  let instrumentos = TotalAlumnos_Orquesta.value
    .map((e) => e.instrumento)
    .sort((a, b) => a - b)
    .reduce((prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev), {});

  //Iterar los instrumentos para obtener la grafica por instrumentos
  for (let clave in instrumentos) {
    pie.value.series.push(instrumentos[clave]);
    pie.value.chartOptions.labels.push(clave);
  }
  //Obtener listados de Asistencias
  _l.value = await Mostrar_todo().then((elem) => elem.map((e) => e.data()));

  //Obtener listados de Alumnos
  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data())
  );

  //Funcion que permite crear una variable global segun la asistencias y fechas
  attendance.value = await Generar_Asistencias_Global();
});
//crear observador watch efectt
watchEffect(async () => {
  switch (model.value) {
    case "hoy":
      break;
    case "semanal":
      Semanal();
      break;
    case "mensual":
      Mensual();
      break;

    default:
      console.log("Aqui Hoy");
      break;
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 150px
</style>
