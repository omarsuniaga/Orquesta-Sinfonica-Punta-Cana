<template>
  <div class="q-pa-md">
    <q-table
      title="Inasistencias Importantes"
      :rows="ObjetoGlobal"
      :columns="columns"
      row-key="name"
      :loading="loading"
    />
    <q-btn label="Descargar Excel" color="primary" @click="descargarExcel" />
    <q-btn label="Descargar PDF" color="secondary" @click="descargarPDF" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { generarResumenGlobalDeAsistencias } from "../FirebaseService/database";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ObjetoGlobal = ref([]);
const columns = ref([
  {
    name: "name",
    required: true,
    label: "Nombre",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "Semanal",
    label: "Semanal",
    align: "left",
    field: "Semanal",
    sortable: true,
  },
  {
    name: "Mensual",
    label: "Mensual",
    align: "left",
    field: "Mensual",
    sortable: true,
  },
  {
    name: "Trimestral",
    label: "Trimestral",
    align: "left",
    field: "Trimestral",
    sortable: true,
  },
]);
const loading = ref(false);

async function loadData() {
  loading.value = true;
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Set start to Monday
    // weekStart.setDate(today.getDate() - today.getDay() + 1); // Set start to Monday

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const trimesterStart = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      1
    );

    const weekAbsences = await calculateAbsences(weekStart, today);
    const monthAbsences = await calculateAbsences(monthStart, today);
    const trimesterAbsences = await calculateAbsences(trimesterStart, today);

    const combinedAbsences = {};

    const combineAbsences = (absences, period) => {
      Object.entries(absences).forEach(([name, data]) => {
        if (!combinedAbsences[name]) {
          combinedAbsences[name] = {
            name,
            Semanal: 0,
            Mensual: 0,
            Trimestral: 0,
          };
        }
        combinedAbsences[name][period] += data[period];
      });
    };

    combineAbsences(weekAbsences, "Semanal");
    combineAbsences(monthAbsences, "Mensual");
    combineAbsences(trimesterAbsences, "Trimestral");

    ObjetoGlobal.value = Object.values(combinedAbsences);
    ObjetoGlobal.value.sort((a, b) => b.Mensual - a.Mensual);
  } catch (error) {
    console.error("Error in loadData:", error);
  } finally {
    loading.value = false;
  }
}

async function calculateAbsences(periodStart, periodEnd) {
  try {
    const attendance = await generarResumenGlobalDeAsistencias();
    const result = {};

    attendance.forEach(({ date, attended, name }) => {
      const attendanceDate = new Date(date);
      if (
        !attended &&
        attendanceDate >= periodStart &&
        attendanceDate <= periodEnd
      ) {
        if (!result[name])
          result[name] = { name, Semanal: 0, Mensual: 0, Trimestral: 0 };

        const daysDiff = (periodEnd - periodStart) / (1000 * 60 * 60 * 24);
        if (daysDiff <= 7) result[name].Semanal++;
        if (attendanceDate.getMonth() === periodStart.getMonth())
          result[name].Mensual++;
        if (daysDiff > 60) result[name].Trimestral++;
      }
    });

    return result;
  } catch (error) {
    console.error("Error in calculateAbsences:", error);
    return {};
  }
}

function descargarExcel() {
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const trimesterStart = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const trimesterEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const dateFormat = { year: "numeric", month: "long", day: "numeric" };
  const weekRange = `${weekStart.toLocaleDateString(
    undefined,
    dateFormat
  )} - ${weekEnd.toLocaleDateString(undefined, dateFormat)}`;
  const month = monthStart.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
  const trimesterRange = `${trimesterStart.toLocaleDateString(
    undefined,
    dateFormat
  )} - ${trimesterEnd.toLocaleDateString(undefined, dateFormat)}`;

  const ws = XLSX.utils.json_to_sheet(ObjetoGlobal.value, { origin: "A7" });
  const wb = XLSX.utils.book_new();

  XLSX.utils.sheet_add_json(
    ws,
    [
      { Info: "Rango de la Semana: " + weekRange },
      { Info: "Mes Actual: " + month },
      { Info: "Trimestre: " + trimesterRange },
    ],
    { origin: "A1" }
  );

  XLSX.utils.book_append_sheet(wb, ws, "Inasistencias");
  XLSX.writeFile(wb, "Inasistencias_Importantes.xlsx");
}

function descargarPDF() {
  const doc = new jsPDF();

  const imgData = "../src/assets/LogoElSistemaPuntaCana.jpg";
  doc.addImage(imgData, "JPEG", 80, 10, 50, 20);

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekRange = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;

  doc.setFontSize(15);
  doc.text(`Listado de Asistencias de la Semana: ${weekRange}`, 50, 35);

  const headers = [["Alumnos", "Semanal", "Mensual", "Trimestral"]];

  const data = ObjetoGlobal.value.map((item) => [
    item.name,
    item.Semanal.toString(),
    item.Mensual.toString(),
    item.Trimestral.toString(),
  ]);

  doc.autoTable({
    head: headers,
    body: data,
    startY: 40,
  });

  doc.save(`Asistencia_${weekRange}.pdf`);
}

onMounted(loadData);
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
