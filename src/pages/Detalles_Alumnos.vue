<template>
  <div class="q-px-md doc-container row flex justify-center">
    <q-list bordered class="rounded-borders" style="">
      <q-item-label header>Listado de Alumnos</q-item-label>
      <span>{{ id }}</span>
      <div class="q-pa-md">
        <q-table
          style="height: 400px"
          :title="id"
          :rows="rows"
          :columns="columns"
          row-key="index"
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
        />
      </div>
    </q-list>
  </div>
</template>

<script setup>

import { ref } from "vue";
import { useQuasar } from "quasar";
import { Crear_Alumnos } from "../firebase";
import { useRouter } from "vue-router";
const url = ref("https://placeimg.com/500/300/nature?t=" + Math.random());
const id = useRouter().currentRoute._rawValue.params.id;
Buscar_Alumno(id).then((elem) => console.log(elem));

const columns = ref([
  {
    name: "index",
    label: "#",
    field: "index",
  },
  {
    name: "name",
    required: true,
    label: "Dessert (100g serving)",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
]);

const seed = ref([
  {
    name: "Frozen Yogurt",
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
    sodium: 87,
    calcium: "14%",
    iron: "1%",
  },
  {
    name: "Ice cream sandwich",
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
    sodium: 129,
    calcium: "8%",
    iron: "1%",
  },
  {
    name: "Eclair",
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
    sodium: 337,
    calcium: "6%",
    iron: "7%",
  },
  {
    name: "Cupcake",
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
    sodium: 413,
    calcium: "3%",
    iron: "8%",
  },
]);

// we generate lots of rows here
let rows = ref([]);
for (let i = 0; i < 1000; i++) {
  rows = seed.value.slice(0).map((r) => ({ ...r }));
}
// rows.value.forEach((row, index) => {
//   row.index = index;
// });

const pagination = ref({
  rowsPerPage: 0,
});
</script>
