<template>
  <div class="q-pa-md">
    <q-toolbar
      class="justify-center flex row"
      style="min-width: 375px; width: 100%"
    >
      <q-btn-toggle
        v-model="model"
        rounded
        spread
        stack
        no-caps
        no-wrap
        toggle-color="primary"
        color="while"
        text-color="primary"
        :options="[
          { value: 'Semanal', slot: 'semanal' },
          { value: 'Mensual', slot: 'mensual' },
          { value: 'Semestral', slot: 'semestral' },
        ]"
      >
        <template v-slot:semanal>
          <div class="row items-center no-wrap">
            <div class="text-center">Semanal</div>
          </div>
        </template>

        <template v-slot:mensual>
          <div class="row items-center no-wrap">
            <div class="text-center">Mensual</div>
          </div>
        </template>

        <template v-slot:semestral>
          <div class="row items-center no-wrap">
            <div class="text-center">Semestral</div>
          </div>
        </template>
      </q-btn-toggle>
    </q-toolbar>
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
    <div class="myCards">
      <q-card class="" v-for="(item, index) in Totales_por_Grupos" :key="index">
        <q-card-section>
          <div class="text-h6">{{ index }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none"> {{ item }} Alumnos </q-card-section>
      </q-card>
    </div>
  </q-toolbar>

  <div class="col-auto">
    <q-card class="q-ma-md" bordered>
      <div class="flex justify-between items-center">
        <q-toolbar>
          <div class="myCards">
            <q-card class="" v-for="(item, index) in Instrumentos" :key="index">
              <q-card-section>
                <div class="text-h6">
                  {{ index === "Vacio" ? "Sin Asignar" : index }}
                </div>
              </q-card-section>
              <q-card-section class="q-pt-none">
                {{ item }} Alumnos
              </q-card-section>
            </q-card>
          </div>
        </q-toolbar>
      </div>
    </q-card>
  </div>
  <div class="col-auto">
    <q-card class="q-ma-md q-pa-md" bordered>
      <HistorialAsistencias />
    </q-card>
    <div class="row justify-center">
      <q-btn flat @click="Salir()" label="Cerrar Sesión" color="warning" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, provide, watchEffect } from "vue";
import {
  Mostrar_todo,
  Mostrar_Listado,
  classificationByGenre,
  Generar_Asistencias_Global,
  Salir,
  auth,
} from "../firebase";

import { useRouter } from "vue-router";
import VueApexCharts from "vue3-apexcharts";
import HistorialAsistencias from "src/components/Historial-Asistencias.vue";
//Variables
let Totales_por_Grupos = ref([]);
let ObjetoGlobal = ref([]);
let attendance = ref([]);
let Alumnos = ref([]);
let Global = ref([]);
let Instrumentos = ref([]);
let _l = ref([]);
let model = ref("Semanal");
let loading = ref(false);
//crear una variable global para usarlo en el dashboar
provide(/* key */ "Global", /* value */ Global.value);

const UnaSemana = async () => {
  let Hoy = await attendance.value
    .filter(({ date, attended }) => {
      const attendenceDate = new Date(date); //Valor de la fecha registrada
      const threeWeeksAgo = new Date(); // valor de la fecha actual
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 7); //resta a la fecha acual 7 dias
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
  ObjetoGlobal.value.PrimerosCinco = SeleccionaPrimerosCinco.map(
    (entry) => entry
  );
  ObjetoGlobal.value.UltimosCinco = SeleccionaUltimosCinco.map(
    (entry) => entry
  );
  return ObjetoGlobal.value;
};
const CuatroSemanas = () => {
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
  ObjetoGlobal.value.PrimerosCinco = ObjetoGlobal.value
    .slice(0, 5)
    .map((entry) => entry);
  ObjetoGlobal.value.UltimosCinco = ObjetoGlobal.value
    .slice(-5)
    .map((entry) => entry);
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
  ObjetoGlobal.value.PrimerosCinco = ObjetoGlobal.value
    .slice(0, 5)
    .map((entry) => entry);
  ObjetoGlobal.value.UltimosCinco = ObjetoGlobal.value
    .slice(-5)
    .map((entry) => entry);

  return ObjetoGlobal.value;
};

//Esta funcion intenta almacenar en un objeto a los alumnos fecha y asistencia
onMounted(async () => {
  //Obtener listados de Alumnos
  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data())
  );

  //Obtener la cantidad de alumnos de cada grupo
  Totales_por_Grupos.value = Alumnos.value.reduce((acc, curr) => {
    curr.grupo.forEach((g) => {
      acc[g] = (acc[g] || 0) + 1;
    });
    return acc;
  }, {});

  //Obtetner la cantidad de alumnos para cada instrumento
  Instrumentos.value = Alumnos.value
    .map((e) => e.instrumento) //mapear todos los instrumentos
    .sort((a, b) => a - b) //ordenarlos alfabeticamente
    .reduce((prev, cur) => ((prev[cur] = prev[cur] + 1 || 1), prev), {}); //contar todos los que se repiten

  //Obtener listados de Asistencias
  _l.value = await Mostrar_todo().then((elem) => elem.map((e) => e.data()));

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
    case "Semanal":
      UnaSemana();
      break;
    case "Mensual":
      CuatroSemanas();
      break;
    case "Semestral":
      TresMeses();
      break;

    default:
      UnaSemana();
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

.myCards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 30px;
  margin: 0.3rem;

  /* Agrega un espacio de 5px entre los rectángulos */
  /* justify-content: end; */
  /* Centra los elements horizontalmente */
  /* align-content: center; */
  /* Centra los elementos verticalmente */
}

@media (max-width: 768px) {
  .myCards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 20px;
    /* Agrega un espacio de 5px entre los rectángulos */
    justify-content: space-around;
    /* Centra los elements horizontalmente */
    /* align-content: center; Centra los elementos verticalmente */
  }
}
</style>
