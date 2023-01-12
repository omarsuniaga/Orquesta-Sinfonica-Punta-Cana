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
    <div>
      <q-toolbar
        class="justify-center flex row"
        style="min-width: 375px; width: 100%"
      >
        <q-btn-toggle
          v-model="model"
          class="col-auto flex justify-around"
          rounded
          spread
          stack
          no-caps
          no-wrap
          toggle-color="primary"
          color="while"
          text-color="primary"
          :options="[
            { value: 'hoy', slot: 'hoy' },
            { value: 'semanal', slot: 'semanal' },
            { value: 'mensual', slot: 'mensual' },
          ]"
        >
          <template v-slot:hoy>
            <div class="row items-center no-wrap">
              <div class="text-center">Esta Semana</div>
            </div>
          </template>

          <template v-slot:semanal>
            <div class="row items-center no-wrap">
              <div class="text-center">Hace 3 Semanas</div>
            </div>
          </template>

          <template v-slot:mensual>
            <div class="row items-center no-wrap">
              <div class="text-center">Hace 3 Meses</div>
            </div>
          </template>
        </q-btn-toggle>
      </q-toolbar>
    </div>
    <q-card
      class="full-width row wrap justify-around items-center content-center"
      bordered
    >
      <q-card-section>
        <div class="cols">
          <div class="text-overline">Los 5 Alumnos de Mayor Asistencias</div>
          <q-item
            v-ripple
            v-for="lista of ObjetoGlobal.PrimerosCinco"
            :key="lista.id"
            class="'bg-green-4'"
          >
            <q-item-section>
              <q-item-label lines="1" class="text-green-3">
                <q-badge rounded color="green" :label="lista[1]"> </q-badge>
                {{ lista[0] }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="cols">
          <div class="text-overline">Los 5 Alumnos de Menor Asistencias</div>
          <q-item
            v-ripple
            v-for="lista of ObjetoGlobal.UltimosCinco"
            :key="lista.id"
            class="'bg-red-4'"
          >
            <q-item-section>
              <q-item-label lines="1" class="text-red-3">
                <q-badge rounded color="red" :label="lista[1]"> </q-badge>
                {{ lista[0] }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div v-if="!loading" class="loading-container">
    <div class="loading"></div>
  </div>

  <q-toolbar>
    <div
      class="full-width row inline wrap justify-between items-center content-center"
    >
      <q-card bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Orquesta</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ TotalAlumnos_Orquesta.length }} Alumnos
        </q-card-section>
      </q-card>

      <q-card bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Coro</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ TotalAlumnos_Coro.length }} Alumnos</q-card-section
        >
      </q-card>

      <q-card bordered class="my-card">
        <q-card-section>
          <div class="text-h6">Solfeo</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          {{ TotalAlumnos_Solfeo.length }} Alumnos</q-card-section
        >
      </q-card>

      <q-card bordered class="my-card">
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
let Global = ref([]);
let Resultado_Busqueda = ref([]);
let TotalAlumnos_Orquesta = ref(0);
let TotalAlumnos_Coro = ref(0);
let TotalAlumnos_Solfeo = ref(0);
let model = ref("hoy");
let _l = ref([]);
let Alumnos = ref([]);
let Fecha = moment().format("LLLL");
let text = "";
let attendance = ref([]);
let loading = ref(false);
//crear una variable global para usarlo en el dashboar
provide(/* key */ "Global", /* value */ Global.value);

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
  const BuscarNombre = (id) => {
    Alumnos.value.filter((elem) =>
      elem.id === id ? (nom = elem.nombre + " " + elem.apellido) : null
    );
    return nom;
  };
  const BuscarGrupo = (id) => {
    let grupo = "";
    Alumnos.value.filter((elem) =>
      elem.id === id ? (grupo = elem.grupo) : null
    );
    return grupo;
  };

  //Itera las fechas que existen
  _l.value.filter((elem) => {
    if (!!elem.Fecha) {
      let { presentes } = elem.Data;
      let { ausentes } = elem.Data;
      presentes.map((el) =>
        Obj.push({
          id: el,
          name: BuscarNombre(el),
          date: elem.Fecha,
          grupo: BuscarGrupo(el),
          attended: true,
        })
      );
      ausentes.map((el) =>
        Obj.push({
          id: el,
          name: BuscarNombre(el),
          date: elem.Fecha,
          grupo: BuscarGrupo(el),
          attended: false,
        })
      );

      return { presentes, ausentes };
    }
    return (attendance.value = Obj);
  });
  //Function to compare two objects
  function compare(a, b) {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return 0;
  }

  Obj.sort(compare);

  //Use reduce to group objects with the same name and date
  const result = Obj.reduce((acc, curr) => {
    const existing = acc.find(
      ({ name, date }) => name === curr.name && date === curr.date
    );
    if (existing) {
      return acc;
    }
    return [...acc, curr];
  }, []);
  Obj = result;
  return Obj;
}

const UltimaSemana = async () => {
  let Hoy = await attendance.value
    .filter(({ date, attended }) => {
      const attendenceDate = new Date(date);
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 7);
      return attended && attendenceDate > threeWeeksAgo;
    })
    .reduce((attendees, { name }) => {
      attendees[name] = (attendees[name] || 0) + 1;
      return attendees;
    }, {});
  //convertir el Objeto Semanas.value en un array
  let HoyArray = ref([]);
  HoyArray.value = Object.entries(Hoy);
  ObjetoGlobal.value = HoyArray.value.sort((a, b) => b[1] - a[1]);

  const SeleccionaPrimerosCinco = ObjetoGlobal.value.slice(0, 5);
  const SeleccionaUltimosCinco = ObjetoGlobal.value.slice(-5);
  const PrimerosCinco = SeleccionaPrimerosCinco.map((entry) => entry);
  const UltimosCinco = SeleccionaUltimosCinco.map((entry) => entry);
  ObjetoGlobal.value.PrimerosCinco = PrimerosCinco;
  ObjetoGlobal.value.UltimosCinco = UltimosCinco;
  return ObjetoGlobal.value;
};
const TresSemanas = () => {
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
  const SeleccionaPrimerosCinco = ObjetoGlobal.value.slice(0, 5);
  const SeleccionaUltimosCinco = ObjetoGlobal.value.slice(-5);
  const PrimerosCinco = SeleccionaPrimerosCinco.map((entry) => entry);
  const UltimosCinco = SeleccionaUltimosCinco.map((entry) => entry);
  ObjetoGlobal.value.PrimerosCinco = PrimerosCinco;
  ObjetoGlobal.value.UltimosCinco = UltimosCinco;
  return ObjetoGlobal.value;
};

const TresMeses = () => {
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
  const SeleccionaPrimerosCinco = ObjetoGlobal.value.slice(0, 5);
  const SeleccionaUltimosCinco = ObjetoGlobal.value.slice(-5);
  const PrimerosCinco = SeleccionaPrimerosCinco.map((entry) => entry);
  const UltimosCinco = SeleccionaUltimosCinco.map((entry) => entry);
  ObjetoGlobal.value.PrimerosCinco = PrimerosCinco;
  ObjetoGlobal.value.UltimosCinco = UltimosCinco;

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
  Global.value.push(attendance.value);

  //si attendance.value es distinto de 0 entonces cambiar el estado de loading
  if (attendance.value.length !== 0) {
    loading.value = true;
  }
});
//crear observador watch efectt
watchEffect(async () => {
  switch (model.value) {
    case "hoy":
      UltimaSemana();
      break;
    case "semanal":
      TresSemanas();
      break;
    case "mensual":
      TresMeses();
      break;

    default:
      UltimaSemana();
      break;
  }
});
</script>
<style scoped>
/* Define el contenedor de la animación de carga */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* Define la animación de carga */
.loading-container .loading {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

/* Define la keyframe de la animación */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<style lang="sass" scoped>
.my-card
  width: 150px
  height: 100px
  margin: 4px
  max-width: 150px
  max-height: 150px
</style>
