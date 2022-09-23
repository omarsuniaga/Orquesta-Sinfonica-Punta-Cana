<script setup>
import moment from "moment";
import { ref, onMounted } from "vue";
import { Mostrar_todo, Mostrar_Listado, Contar_Ausentes } from "../firebase";
import VueApexCharts from "vue3-apexcharts";
console.log(VueApexCharts);

let _l = ref([]);
let Alumnos = ref([]);
let PRESENTES = [];
let AUSENTES = [];
let diasRegistrados = ref("");

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
  {
    name: "Serial",
    label: "Serial",
    field: "Serial",
    sortable: true,
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
  let Listado = [];
  if (_l.value) {
    _l.value.filter((elem) => {
      if (elem.Fecha.split("-")[1] === mes) {
        let { ausentes, presentes } = elem.Data;
        diasRegistrados.value++;
        presentes.map((el) => PRESENTES.push(el));
        ausentes.map((el) => AUSENTES.push(el));
        return PRESENTES, AUSENTES;
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

onMounted(async () => {
  _l.value = await Mostrar_todo().then((elem) => elem.map((e) => e.data())); //Jalando asistencias
  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data())
  );
  _a("08", "Orquesta");
});
</script>
<template>
  <div>
    <q-table
      style="height: 400px"
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
