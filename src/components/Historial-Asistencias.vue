<script setup>
import { ref, onMounted } from "vue";
import { Mostrar_todo, Mostrar_Listado, Contar_Ausentes } from "../firebase";
let _l = ref([]);
let Alumnos = ref([]);
let PRESENTES = ref([]);
let AUSENTES = ref([]);
let array3 = ref([]);
let pagination = ref({
  rowsPerPage: 0,
});
const columns = [
  {
    name: "id",
    label: "#",
  },
  {
    name: "name",
    required: true,
    label: "Grupo",
    align: "left",
    field: (row) => row.Asistencias,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Total",
    align: "center",
    label: "Total",
    field: "Total",
    sortable: true,
  },
];

let _a = (mes) => {
  // ? Buscar todas las fechas del mes seleccionado
  _l.value.filter((elem) => {
    if (elem.Fecha.split("-")[1] === mes) {
      let { ausentes, presentes } = elem.Data;

      presentes.map((el) => PRESENTES.value.push(el));
      ausentes.map((el) => AUSENTES.value.push(el));
      return;
    }
  });

  function BuscarAlumno(id) {
    let nom = "";
    Alumnos.value.filter((elem) =>
      elem.id === id ? (nom = elem.nombre + " " + elem.apellido) : null
    );
    return nom;
  }

  const Presencias = PRESENTES.value.filter((id, i) =>
    i == 0 ? true : PRESENTES.value[i - 1] != id
  );
  const Ausencias = AUSENTES.value.filter((id, i) =>
    i == 0 ? true : AUSENTES.value[i - 1] != id
  );
  const contadorPresencias = Presencias.map((el) => {
    return { id: el, Presencias: 0 };
  });
  const contadorAusencias = Ausencias.map((el) => {
    return { id: el, Ausencias: 0 };
  });

  contadorPresencias.map((item, i) => {
    const id_unico = PRESENTES.value.filter((id) => id === item.id).length;
    item.Presencias = id_unico;
  });
  contadorAusencias.map((item, i) => {
    const id_unico = AUSENTES.value.filter((id) => id === item.id).length;
    item.Ausencias = id_unico;
  });

  return array3.value;
};

const titulo = [
  {
    label: "Orquesta",
    total: 2,
  },
];

let rows = [];
rows = rows.concat(titulo.slice(0).map((r) => ({ ...r })));

onMounted(async () => {
  _l.value = await Mostrar_todo().then((elem) => elem.map((e) => e.data()));
  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data())
  );
  console.log(_a("08"));
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
