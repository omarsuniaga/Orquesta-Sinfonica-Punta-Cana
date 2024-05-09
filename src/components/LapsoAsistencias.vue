<template>
  <div class="q-pa-md">
    <q-table
      title="Inasistencias Importantes"
      :rows="ObjetoGlobal"
      :columns="columns"
      row-key="name"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from "vue";
import { Mostrar_Listado, Generar_Asistencias_Global } from "../firebase";

const ObjetoGlobal = ref([]);

let attendance = ref([]);
let loading = ref(false);

provide("Global", ObjetoGlobal);

const columns = [
  {
    name: "name",
    label: "Nombre",
    field: "name",
    sortable: true,
    align: "center",
  },
  {
    name: "Semanal",
    sortable: true,
    required: true,
    label: "Semanal",
    align: "left",
    field: "Semanal",
  },
  {
    name: "Mensual",
    sortable: true,
    required: true,
    label: "Mensual",
    align: "left",
    field: "Mensual",
  },
  {
    name: "Trimestral",
    required: true,
    label: "Trimestral",
    align: "left",
    field: "Trimestral",
    sortable: true,
  },
];

const calculateAbsences = async (days, period) => {
  return attendance.value
    .filter(({ date, attended }) => {
      const attendanceDate = new Date(date);
      const periodAgo = new Date();
      periodAgo.setDate(periodAgo.getDate() - days);
      return !attended && attendanceDate > periodAgo;
    })
    .reduce((absentees, { name }) => {
      if (!absentees[name]) {
        absentees[name] = { name, Semanal: 0, Mensual: 0, Trimestral: 0 };
      }
      absentees[name][period] += 1;
      return absentees;
    }, {});
};

const ausencias = async () => {
  const weekAbsences = await calculateAbsences(7, "Semanal");
  const monthAbsences = await calculateAbsences(30, "Mensual");
  const trimesterAbsences = await calculateAbsences(90, "Trimestral");

  const sortedByWeek = Object.values(weekAbsences).sort(
    (a, b) => b.Semanal - a.Semanal
  );

  ObjetoGlobal.value = sortedByWeek.map((student) => ({
    name: student.name,
    Semanal: student.Semanal,
    Mensual: monthAbsences[student.name]?.Mensual || 0,
    Trimestral: trimesterAbsences[student.name]?.Trimestral || 0,
  }));
};

onMounted(async () => {
  const students = await Mostrar_Listado();
  attendance.value = await Generar_Asistencias_Global();
  loading.value = true;
  await ausencias();
  loading.value = false;
});
</script>

<style scoped>
.q-pa-md {
  background-color: #f5f5f5;
}

.q-table {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.q-table::-webkit-scrollbar {
  display: none;
}
</style>
