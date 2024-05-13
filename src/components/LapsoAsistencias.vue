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
// import { Generar_Asistencias_Global } from "../firebase";
import * as XLSX from "xlsx";
import { QBtn } from "quasar";
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
let loading = ref(false);

async function loadData() {
  loading.value = true;
  const today = new Date();
  const weekStart = new Date(
    today.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    )
  );
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const trimesterStart = new Date(today.getFullYear(), today.getMonth() - 2, 1);

  const weekAbsences = await calculateAbsences(weekStart, new Date());
  const monthAbsences = await calculateAbsences(monthStart, new Date());
  const trimesterAbsences = await calculateAbsences(trimesterStart, new Date());

  ObjetoGlobal.value = Object.values(weekAbsences).map((student) => ({
    name: student.name,
    Semanal: student.Semanal,
    Mensual: monthAbsences[student.name]?.Mensual || 0,
    Trimestral: trimesterAbsences[student.name]?.Trimestral || 0,
  }));

  ObjetoGlobal.value.sort((a, b) => b.Mensual - a.Mensual); // Sort data by 'Mensual'
  loading.value = false;
}

async function calculateAbsences(periodStart, periodEnd) {
  let attendance = await generarResumenGlobalDeAsistencias();
  // let attendance = await Generar_Asistencias_Global();

  let result = {};
  attendance.forEach(({ date, attended, name }) => {
    let attendanceDate = new Date(date);
    if (
      !attended &&
      attendanceDate >= periodStart &&
      attendanceDate <= periodEnd
    ) {
      if (!result[name])
        result[name] = { name, Semanal: 0, Mensual: 0, Trimestral: 0 };
      result[name][periodStart === periodEnd ? "Semanal" : "Mensual"]++;
      if (periodEnd.getMonth() - periodStart.getMonth() >= 2) {
        result[name].Trimestral++;
      }
    }
  });

  return result;
}

function descargarExcel() {
  const today = new Date();
  const weekStart = new Date(
    today.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    )
  );
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const trimesterStart = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const trimesterEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Formatear fechas para mostrar
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

  // Crear hoja de Excel
  const ws = XLSX.utils.json_to_sheet(ObjetoGlobal.value, { origin: "A7" }); // Dejar espacio para el encabezado
  const wb = XLSX.utils.book_new();

  // Añadir información adicional en la parte superior de la hoja
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

  // Agregar logo de la empresa
  // Supongamos que el logo está en formato base64 o puedes cargarlo de un URL
  const imgData = "../src/assets/LogoElSistemaPuntaCana.jpeg"; // Debes reemplazar esto con el path correcto a tu logo
  // quiero el logo centrado a la derecha
  doc.addImage(imgData, "JPEG", 170, 10, 30, 15);

  // Calcula fechas
  const today = new Date();
  const monthName = today.toLocaleString("default", { month: "long" });
  const weekStart = new Date(
    today.setDate(
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
    )
  );
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const weekRange = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;

  // Título del documento
  doc.setFontSize(18);
  // quiero el título centrado
  doc.text(`Semana: ${weekRange}`, 50, 35);

  // Datos para la tabla
  const headers = [["Alumnos", `${weekRange}`, `${monthName}`]];

  const data = ObjetoGlobal.value.map((item) => [
    item.name,
    item.Semanal.toString(),
    item.Mensual.toString(),
    // item.Trimestral.toString(),
  ]);

  // Añadir tabla
  doc.autoTable({
    head: headers,
    body: data,
    startY: 40,
  });

  // Descargar el PDF
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
