<template>
  <q-btn color="warning" text-color="black" label="PDF" @click="descargarPDF" />
</template>

<script setup>
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { onMounted, ref } from "vue";
import { defineProps } from "vue";
import { buscarAlumnoPorId } from "../FirebaseService/database";
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
  ausentes: Array,
  presentes: Array,
});

const listadoGeneral = ref([]);

async function descargarPDF() {
  if (!props.fecha || !props.grupo || !props.ausentes || !props.presentes) {
    console.error("Datos de ausentes o presentes no disponibles.");
    return; // Detener la ejecución si los datos necesarios no están disponibles
  }

  // iterar ausentes y presentes para obtener los datos de los alumnos, su nombre y apellido y id de alumno
  const alumnos = props.ausentes.concat(props.presentes);
  for (const alumno of alumnos) {
    const doc = await buscarAlumnoPorId(alumno.id);
    if (doc && doc.id === alumno.id) {
      listadoGeneral.value.push({
        Nombre: doc.nombre + " " + doc.apellido,
        Asistencia: alumno.asistencia ? "Presente" : "Ausente",
        grupo: doc.grupo,
        instrumento: doc.instrumento,
      });
    }
  }

  // Ordenar listadoGeneral por asistencia, los presentes primero
  listadoGeneral.value.sort((a, b) => (a.Asistencia === "Presente" ? -1 : 1));

  try {
    // Crear el PDF
    const doc = new jsPDF();
    const imgData = "../src/assets/LogoElSistemaPuntaCana.jpg"; // Debes reemplazar esto con el path correcto a tu logo
    doc.addImage(imgData, "JPEG", 135, 10, 60, 30);

    doc.setFontSize(18);
    doc.text(`Asistencia de ${convertDateFormatToSpanish(props.fecha)}`, 15, 30);
    doc.setFontSize(12);
    doc.text(`Grupo: ${props.grupo}`, 15, 40);

    const columns = [
      { header: "Alumno", dataKey: "nombre" },
      { header: "Grupo", dataKey: "grupo" },
      { header: "Instrumento", dataKey: "instrumento" },
      { header: "Asistencia", dataKey: "asistencia" },
    ];

    const data = listadoGeneral.value.map((alumno) => ({
      nombre: alumno.Nombre,
      asistencia: alumno.Asistencia,
      grupo: alumno.grupo,
      instrumento: alumno.instrumento,
    }));

    doc.autoTable({
      columns: columns,
      body: data,
      startY: 50,
    });

    doc.save(`Asistencia_${convertDateFormat(props.fecha)}.pdf`);
  } catch (error) {
    console.error("Error al descargar el PDF:", error);
  }
}
</script>
