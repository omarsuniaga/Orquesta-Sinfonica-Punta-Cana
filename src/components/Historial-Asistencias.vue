<script setup>
import moment from "moment";
import { ref, onMounted, computed, watchEffect } from "vue";
import { Mostrar_todo, Mostrar_Listado, Contar_Ausentes } from "../firebase";
// import VueApexCharts from "vue3-apexcharts";
// console.log(VueApexCharts);

let _l = ref([]);
let Alumnos = ref([]);
let PRESENTES = [];
let AUSENTES = [];
let diasRegistrados = ref("");
let meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
let num = ref(0);
let numMes = ref(0);
let rows = ref([]);

const columns = [
  {
    name: "index",
    label: "#",
    field: "index",
  },
  {
    name: "Nombre",
    required: true,
    label: "Nombre",
    align: "left",
    field: (row) => row.Nombre,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Asistencia",
    align: "center",
    label: "Asistencia (P)",
    field: "Asistencia",
    sortable: true,
  },
  {
    name: "Inasistencia",
    label: "Inasistencia (A)",
    field: "Inasistencia",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: "Rendimiento",
    label: "Rendimiento (%)",
    field: "Rendimiento",
    sortable: true,
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];
const ObtenerDia = (dia) => {
  let f = moment(dia).day();
  let Semana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    " Viernes",
    "Sabado",
  ];
  f = Semana.filter((e, i) => (i === f ? e : null));
  return f;
};
let BuscarAlumno = (id) => {
  let nom = "";
  Alumnos.value.filter((elem) =>
    elem.id === id ? (nom = elem.nombre + " " + elem.apellido) : null
  );
  return nom;
};
const clasificacion = (grupo) => {
  rows.value = [];
  rows.value = grupo.map((el, i) => {
    return {
      index: i + 1,
      Nombre: "",
      Asistencia: 0,
      Inasistencia: 0,
      Rendimiento: 0,
      Serial: el,
    };
  });
  rows.value.map((item) => {
    const p = PRESENTES.filter((id) => id === item.Serial).length;
    const a = AUSENTES.filter((id) => id === item.Serial).length;
    item.Asistencia = p;
    item.Inasistencia = a;
    item.Nombre = BuscarAlumno(item.Serial);
    item.Rendimiento = p + a / diasRegistrados.value;
    return item;
  });
  return rows.value;
};
let _a = (mes, grupo) => {
  rows.value = [];
  let Listado = [];
  if (_l.value) {
    _l.value.filter((elem) => {
      if (elem.Fecha.split("-")[1] === mes) {
        let { ausentes, presentes } = elem.Data;
        diasRegistrados.value++;
        presentes.map((el) => PRESENTES.push(el));
        ausentes.map((el) => AUSENTES.push(el));
        return PRESENTES, AUSENTES;
      } else {
        return (num.value = "08");
      }
    });
  } else {
    return;
  }
  Alumnos.value.filter((el) =>
    el.grupo.map((e) => (e === grupo ? Listado.push(el.id) : null))
  );
  return clasificacion(Listado);
};
let pagination = ref({
  rowsPerPage: 0,
});
const aumentarMes = () => {
  num.value++;
  numMes.value++;
  numMes.value = numMes.value >= 11 ? (numMes.value = 0) : numMes.value++;
  num.value =
    num.value <= 9
      ? "0" + num.value.toString()
      : num.value <= 12 && num.value >= 10
      ? num.value.toString()
      : "0" + (num.value = 1).toString();
  return num.value;
};
const disminuirMes = () => {
  numMes.value--;
  numMes.value = numMes.value <= 0 ? (numMes.value = 11) : numMes.value--;
  num.value--;
  num.value =
    num.value <= 9
      ? "0" + num.value
      : num.value <= 12
      ? num.value.toString()
      : (num.value = 1);
  return num.value;
};
onMounted(async () => {
  _l.value = await Mostrar_todo().then((elem) => elem.map((e) => e.data())); //Jalando asistencias
  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data())
  );
});
watchEffect(async () => {
  console.log(num.value);
  _a(num.value, "Orquesta");
});
</script>
<template>
  <div>
    <div class="flex justify-between q-pa-sm">
      <q-btn
        rounded
        stack
        toggle-color="primary"
        color="while"
        text-color="primary"
        label="-"
        @click="disminuirMes"
      />
      <span> mes: ({{ num }}) </span>
      <q-btn
        rounded
        stack
        toggle-color="primary"
        color="while"
        text-color="primary"
        label="+"
        @click="aumentarMes"
      />
    </div>
    <q-table
      style="min-height: 350px"
      title="Asistencias"
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    />
  </div>
</template>
<style></style>
