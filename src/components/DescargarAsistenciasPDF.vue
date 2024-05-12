<template>
  <div class="q-pa-sm">
    <q-btn
      color="warning"
      text-color="black"
      label="PDF"
      @click="descargarPDF"
      round
    />
  </div>
</template>

<script setup>
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { onMounted, ref } from "vue";
import { defineProps } from "vue";
import { Buscar_Por_Fecha, Buscar_Alumno } from "src/firebase";
import moment from "moment";
import "moment/locale/es"; // Importar localización en español

moment.locale("es"); // Establecer localización global en español

function convertDateFormat(fecha) {
  return moment(fecha, "YYYY-MM-DD").format("DD-MM-YYYY");
}
function convertDateFormatToSpanish(fecha) {
  return moment(fecha).format("D [de] MMMM [de] YYYY");
}

const props = defineProps({
  fecha: String,
  grupo: String,
});

const listadoGeneral = ref([]);

function descargarPDF() {
  if (props.fecha === "") {
    console.error("Datos de ausentes o presentes no disponibles.");
    return; // Detener la ejecución si los datos necesarios no están disponibles
  }

  const doc = new jsPDF();
  const imgData = "../src/assets/LogoElSistemaPuntaCana.jpg"; // Debes reemplazar esto con el path correcto a tu logo
  // quiero el logo centrado a la derecha
  doc.addImage(imgData, "JPEG", 135, 10, 60, 30);
  // tamaño de la imagen 30x15

  doc.setFontSize(18);
  doc.text(`Asistencia de ${convertDateFormatToSpanish(props.fecha)}`, 15, 30);
  doc.setFontSize(12);
  doc.text(`Grupo: ${props.grupo}`, 15, 40);

  const columns = [
    { header: "Alumno", dataKey: "nombre" },
    { header: "Grupo", dataKey: "grupo" },
    { header: "Asistencia", dataKey: "asistencia" },
  ];

  const data = [
    ...listadoGeneral.value.map((alumno) => ({
      nombre: alumno.Nombre,
      grupo: alumno.Grupo,
      asistencia: alumno.Asistencia,
    })),
  ];

  doc.autoTable({
    columns: columns,
    body: data,
    startY: 50,
  });

  doc.save(`Asistencia_${convertDateFormat(props.fecha)}.pdf`);
}

onMounted(async () => {
  let asistenciasDelDia = await Buscar_Por_Fecha(props.fecha);
  // Asegúrate de que asistenciasDelDia es un array y no está vacío
  if (asistenciasDelDia.length === 0) {
    console.log("No hay registros para esta fecha.");
    return;
  }
  // Iterar sobre cada asistencia del día

  asistenciasDelDia.forEach((asistencia) => {
    asistencia.data.presentes.forEach((p) => {
      Buscar_Alumno(p).then((alumno) => {
        listadoGeneral.value.push({
          Nombre: alumno.nombre + " " + alumno.apellido,
          Grupo: alumno.grupo,
          Asistencia: "Presente",
        });
      });
    });
    asistencia.data.ausentes.forEach((a) => {
      Buscar_Alumno(a).then((alumno) => {
        listadoGeneral.value.push({
          Nombre: alumno.nombre + " " + alumno.apellido,
          Grupo: alumno.grupo,
          Asistencia: "Ausente",
        });
      });
    });
    // ordenar por grupo
    listadoGeneral.value.sort((a, b) => a.Grupo.localeCompare(b.Grupo));
  });
});
</script>
