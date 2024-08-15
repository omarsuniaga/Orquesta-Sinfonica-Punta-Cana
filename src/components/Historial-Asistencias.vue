<script setup>
import { ref, onMounted } from "vue";
import { obtenerAsistencias } from "../FirebaseService/database";
import VueApexCharts from "vue3-apexcharts";

const linea = ref({
  series: [],
  chartOptions: {
    chart: {
      type: "area",
      height: 550,
      title: {
        text: "Asistencia por Grupo",
        align: "left",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
  },
});

const asistencias = ref([]);
const pagination = ref({ rowsPerPage: 10 });
const separator = ref("cell");
const rows = ref([]);
const columns = [
  {
    name: "Fecha",
    label: "Fecha",
    field: "Fecha",
    sortable: true,
    align: "center",
    sort: (a, b) => new Date(a) - new Date(b),
  },
  {
    align: "center",
    name: "Grupo",
    label: "Grupo",
    field: "Grupo",
    sortable: true,
  },
  {
    name: "Presentes",
    required: true,
    label: "Presentes",
    align: "center",
    field: "Presentes",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Ausentes",
    required: true,
    align: "center",
    label: "Ausentes",
    field: "Ausentes",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Dia",
    required: true,
    align: "center",
    label: "Dia",
    field: "Dia",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "index",
    label: "ID",
    align: "center",
    required: true,
    sortable: true,
    field: "index",
    format: (val) => `${val}`,
  },
];

onMounted(async () => {
  try {
    const data = await obtenerAsistencias();
    if (Array.isArray(data)) {
      asistencias.value = data;
    } else {
      console.error("obtenerAsistencias no devolvió un array");
    }

    let asistenciasPorMesYGrupo = {};

    // Agrupar asistencias por mes, año y grupo
    asistencias.value.forEach((asistencia) => {
      let fecha = new Date(asistencia.Fecha);
      let mes = fecha.getMonth() + 1;
      let año = fecha.getFullYear();
      let clave = `${mes}-${año}-${asistencia.Grupo}`;

      if (!asistenciasPorMesYGrupo[clave]) {
        asistenciasPorMesYGrupo[clave] = [];
      }

      asistenciasPorMesYGrupo[clave].push(asistencia);
    });

    let totalAsistenciasPorMesYGrupo = Object.keys(asistenciasPorMesYGrupo).map(
      (clave) => {
        let [mes, año, grupo] = clave.split("-");
        return {
          mes,
          año,
          grupo,
          totalAsistencias: asistenciasPorMesYGrupo[clave].length,
        };
      }
    );

    let seriesPorGrupo = {};

    // Construir series de datos para cada grupo
    totalAsistenciasPorMesYGrupo.forEach((asistencia) => {
      if (!seriesPorGrupo[asistencia.grupo]) {
        seriesPorGrupo[asistencia.grupo] = [];
      }

      seriesPorGrupo[asistencia.grupo].push([
        new Date(`${asistencia.mes}/01/${asistencia.año}`).getTime(),
        asistencia.totalAsistencias,
      ]);
    });

    linea.value.series = Object.keys(seriesPorGrupo).map((grupo) => {
      return { name: grupo, data: seriesPorGrupo[grupo] };
    });

    linea.value.chartOptions.xaxis.categories =
      totalAsistenciasPorMesYGrupo.map(
        (asistencia) => `${asistencia.mes}/01/${asistencia.año}`
      );
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
  }
});
</script>

<template>
  <div class="col-auto">
    <VueApexCharts
      type="area"
      height="350"
      :options="linea.chartOptions"
      :series="linea.series"
    ></VueApexCharts>
  </div>
</template>

<style>
.cols {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}
</style>
