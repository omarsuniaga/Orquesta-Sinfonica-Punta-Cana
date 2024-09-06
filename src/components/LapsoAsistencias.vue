<template>
  <div>
    <q-table
      title="Inasistencias Importantes"
      :rows="ObjetoGlobal"
      :columns="columns"
      row-key="name"
      :loading="loading"
    />
    <div class="flex justify-around q-pa-sm">
      <q-btn label="Descargar Excel" color="primary" @click="descargarExcel" />
      <q-btn label="Descargar PDF" color="secondary" @click="descargarPDF" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { generarResumenGlobalDeAsistencias } from "../FirebaseService/database";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ObjetoGlobal = ref([
  {
    name: "Cargando...",
    Semanal: 0,
    Mensual: 0,
    Trimestral: 0,
  },
]);
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
    label: "Sem",
    align: "left",
    field: "Semanal",
    sortable: true,
  },
  {
    name: "Mensual",
    label: "Men",
    align: "left",
    field: "Mensual",
    sortable: true,
  },
  {
    name: "Anual",
    label: "Anual",
    align: "left",
    field: "Anual",
    sortable: true,
  },
]);
const loading = ref(false);

async function loadData() {
  try {
    loading.value = true;
    const today = new Date();

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Set start to Monday

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const yearStart = new Date(today.getFullYear(), 0, 1); // Start of the year

    const weekAbsences = await calculateAbsences(weekStart, today);
    const monthAbsences = await calculateAbsences(monthStart, today);
    const yearAbsences = await calculateAbsences(yearStart, today);

    const combinedAbsences = {};

    const combineAbsences = (absences, period) => {
      Object.entries(absences).forEach(([name, data]) => {
        if (!combinedAbsences[name]) {
          combinedAbsences[name] = {
            name,
            Semanal: 0,
            Mensual: 0,
            Anual: 0,
          };
        }
        combinedAbsences[name][period] += data[period];
      });
    };

    combineAbsences(weekAbsences, "Semanal");
    combineAbsences(monthAbsences, "Mensual");
    combineAbsences(yearAbsences, "Anual");

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
          result[name] = { name, Semanal: 0, Mensual: 0, Anual: 0 };

        const daysDiff = (periodEnd - periodStart) / (1000 * 60 * 60 * 24);
        if (daysDiff <= 7) result[name].Semanal++;
        if (attendanceDate.getMonth() === periodStart.getMonth())
          result[name].Mensual++;
        if (attendanceDate.getFullYear() === periodStart.getFullYear())
          result[name].Anual++;
      }
    });

    return result;
  } catch (error) {
    console.error("Error in calculateAbsences:", error);
    return {};
  }
}

function descargarExcel() {
  const today = new Date(); // obtener el día actual
  const threeMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 3,
    today.getDate()
  ); // hace 3 meses

  const dateFormat = { year: "numeric", month: "long", day: "numeric" }; // formato de fecha

  // Generar un array de fechas desde hace 3 meses hasta hoy
  const dateRange = [];
  for (
    let d = new Date(threeMonthsAgo);
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    dateRange.push(new Date(d));
  }

  // Crear la hoja de Excel
  const ws = XLSX.utils.json_to_sheet(ObjetoGlobal.value, { origin: "A7" });
  const wb = XLSX.utils.book_new();

  // Agregar información de rango de fechas
  XLSX.utils.sheet_add_json(
    ws,
    [
      {
        Info:
          "Rango de Fechas: " +
          threeMonthsAgo.toLocaleDateString(undefined, dateFormat) +
          " - " +
          today.toLocaleDateString(undefined, dateFormat),
      },
    ],
    { origin: "A1" }
  );

  // Agregar datos diarios
  dateRange.forEach((date, index) => {
    const dateStr = date.toLocaleDateString(undefined, dateFormat);
    XLSX.utils.sheet_add_json(
      ws,
      [{ Fecha: dateStr, Asistencia: "Datos de asistencia aquí" }], // Reemplaza "Datos de asistencia aquí" con los datos reales
      { origin: `A${index + 3}` } // Ajusta la posición según sea necesario
    );
  });

  // Agregar la hoja al libro y descargar el archivo
  XLSX.utils.book_append_sheet(wb, ws, "Asistencia Diaria"); // nombre de la hoja
  XLSX.writeFile(
    wb,
    `Asistencia_Diaria_${threeMonthsAgo.toLocaleDateString(
      undefined,
      dateFormat
    )}_a_${today.toLocaleDateString(undefined, dateFormat)}.xlsx`
  ); // nombre del archivo
}

function descargarPDF() {
  const doc = new jsPDF();

  const imgData = "../src/assets/LogoElSistemaPuntaCana.jpg";
  doc.addImage(imgData, "JPEG", 80, 10, 50, 20);

  const today = new Date();
  const yearStart = new Date(today.getFullYear(), 0, 1); // Inicio del año
  const dateFormat = { year: "numeric", month: "long", day: "numeric" };
  const dateRange = `${yearStart.toLocaleDateString()} - ${today.toLocaleDateString()}`;

  doc.setFontSize(15);
  doc.text(`Listado de Asistencias desde ${dateRange}`, 50, 35);

  const headers = [
    ["ID", "Nombre Completo", "Día", "Mes", "Año", "Asistencia"],
  ];

  const data = ObjetoGlobal.value.map((item) => {
    const attendanceDate = new Date(item.date);
    return [
      item.id,
      item.name,
      attendanceDate.getDate(),
      attendanceDate.toLocaleString("es-ES", { month: "long" }),
      attendanceDate.getFullYear(),
      item.attendanceStatus,
    ];
  });

  doc.autoTable({
    head: headers,
    body: data,
    startY: 40,
  });

  doc.save(`Asistencia_${dateRange}.pdf`);
}

onMounted(loadData());
</script>

<style scoped>
.q-table {
  max-height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.q-table::-webkit-scrollbar {
  display: none;
}
</style>
