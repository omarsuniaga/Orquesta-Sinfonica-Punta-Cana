<template>
  <div class="q-px-lg q-pb-md">
    <h5>Reseña</h5>
    <span>{{ informacion }}</span>
    <q-timeline
      color="secondary"
      v-for="(item, index) in res"
      :key="index"
      :subtitle="item.Fecha"
    >
      <q-timeline-entry heading :body="item.FechaCorta" />

      <q-timeline-entry
        v-for="(item, index) in res"
        :key="index"
        :subtitle="item.Fecha.split('-').reverse().join('-')"
      >
        {{ item.Fecha.split("-")[1] }}
        <div
          class="row"
          style="width: 100%; max-width: 700px; min-width: 140px"
        >
          <div class="col-6">
            <q-card class="card1 q-mx-md q-pa-sm bg-grey-2 text-white">
              <q-card-section>
                <div class="text-h6 text-black">Repertorio</div>
              </q-card-section>
              <q-separator />
              <q-card-section class="text-black">
                <div class="row items-center">
                  <div class="col-6">
                    <span class="text-md text-weight-bold">{{
                      item.Obra
                    }}</span>
                  </div>
                  <div class="col-6">
                    <q-knob
                      :step="5"
                      v-model="item.Ejecucion"
                      show-value
                      size="50px"
                      :thickness="0.22"
                      color="lime"
                      track-color="lime-3"
                      class="text-lime q-ma-md"
                      :disable="!editable"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-timeline-entry>
    </q-timeline>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Nivel_Alumno } from "../data";
import { obtenerAsistenciaPorId } from "../FirebaseService/database";
import {
  Buscar_Alumno,
  Generar_Asistencias_Global,
  diasTrabajados,
} from "../firebase";
const props = defineProps({
  editable: Boolean,
});
const id = useRouter().currentRoute._rawValue.params.id;
let informacion = ref(null);
let res = ref(null);
let TotalAsistencia = 0;
let resumen = {
  inicio: "",
  contextoInstrumento: "",
  contextoGrupo: "",
  contextoNivel: "",
  contextoTiempo: "",
  contextoAsistencia: "",
  contextoInsigneas: "",
};

// console.log("asistencias", asistencias);
// let {
//   NivelVibrato,
//   TiempoTocando,
//   Instrumento,
//   Fila,
//   Atril,
//   FechaRegistrado,
//   Nivel,
//   Grupo,
// } = Nivel_Alumno();

// let Frase1 =
//   Grupo === "Orquesta"
//     ? `tocando en la ${Grupo} el ${Instrumento}. Pertenece a la Fila de ${Fila} en el atril ${Atril} por su nivel`
//     : Grupo === "Coro"
//     ? `cantando en el ${Grupo}. Pertenece a la Fila de ${Fila}`
//     : Grupo === "Iniciacion 1"
//     ? `en las filas de ${Grupo}. Necesita mas tiempo para subir de nivel`
//     : null;
// const informacion = `Este Alumno empezó el ${FechaRegistrado} en el nivel ${Nivel}, tiene ${TiempoTocando} ${Frase1}`;
// const op1 = async (res) => {
//   console.log((CalidadSonido = res));
// };
onMounted(async () => {
  //extraer alumno segun id de firebase
  let alumno = await Buscar_Alumno(id);
  let instrumento = alumno.instrumento.split(" ")[0];
  let asistencias = await obtenerAsistenciaPorId(id);
  console.log(asistencias, "asistencias");

  function convertirFecha(fecha) {
    const date = new Date(fecha);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const spanishDate = date.toLocaleDateString("es-ES", options);
    return spanishDate;
  }

  function CalcularEdad(tiempo) {
    const today = new Date();
    const birthDate = new Date(tiempo);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }
  function cambiarFormatoFecha(fecha) {
    // Separar día, mes y año en un arreglo
    const partes = fecha.split("-");
    // Crear una fecha en formato "AAAA/MM/DD"
    const fechaNueva = new Date(partes[2], partes[1] - 1, partes[0]);
    // Devolver la fecha en formato "AAAA-MM-DD"
    return fechaNueva.toISOString().substring(0, 10);
  }

  function calcularMeses(fecha) {
    //DD/MM/YYYY
    const date = new Date(cambiarFormatoFecha(fecha));
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    const today = new Date();
    const from = new Date(formattedDate);
    const months =
      (today.getFullYear() - from.getFullYear()) * 12 +
      (today.getMonth() - from.getMonth());
    const years = Math.floor(months / 12);
    return `${
      years > 1 ? years + " años con" : years < 1 ? " " : years + " Año con"
    }  ${
      months % 12 > 1
        ? (months % 12) + " meses"
        : months % 12 < 1
        ? " "
        : (months % 12) + " Mes"
    }`;
  }

  let insigneas = "5";
  let nivel =
    TotalAsistencia >= 0 && TotalAsistencia <= 25
      ? "nivel Muy Bajo"
      : TotalAsistencia >= 26 && TotalAsistencia <= 40
      ? "nivel Bajo"
      : TotalAsistencia >= 41 && TotalAsistencia <= 65
      ? "nivel notable"
      : TotalAsistencia >= 66 && TotalAsistencia <= 79
      ? "muy buen nivel"
      : "Excelente nivel";
  resumen.inicio = `
  ${alumno.sexo === "Masculino" ? "El Alumno " : "La Alumna "}
  ${alumno.nombre} ${alumno.apellido}`;

  resumen.contextoInstrumento = `
  en este tiempo escogio desarrollarse en ${instrumento}
  empezar el nivel que segun su tiempo y rendimiento le
  ha permitido llegar.`;

  resumen.contextoTiempo = ` Se registró un ${convertirFecha(
    alumno.registro
  )} y tiene
  de haber empezado sus estudios en la Fundacion  ${calcularMeses(
    alumno.fecInscripcion
  )}.`;

  resumen.contextoGrupo = ` Actualmente se encuentra en ${
    alumno.grupo == "Orquesta" ? " la " : " el "
  } ${alumno.grupo}`;
  resumen.contextoNivel = ` tocando en la fila de  ${alumno.instrumento}.`;
  resumen.contextoAsistencia = `
  obteniendo una asistencia total de ${TotalAsistencia}% `;
  resumen.contextoInsigneas = `
   y ha alcanzado ${insigneas} insignias que representan
   algunos retos individuales. Lo que representa un ${nivel}
   en responsabilidad, entrega y disciplina. `;

  informacion.value =
    resumen.inicio +
    resumen.contextoInstrumento +
    resumen.contextoGrupo +
    resumen.contextoNivel +
    resumen.contextoTiempo +
    resumen.contextoAsistencia +
    resumen.contextoInsigneas;

  // let { Repertorios } = await PROCESOS(id);
  // console.log(await PROCESOS(id));
  // Repertorios = Repertorios.map((elem)=>elem.Fecha.);
  // res.value = Repertorios.map((elem) => {
  //   let mes = elem.Fecha.split("-")[1]; // 03
  //   let anio = elem.Fecha.split("-")[0]; // 2022
  //   let mesNumero = meses[parseInt(mes) - 1]; // 3 => Marzo => 2 arrays[]
  //   let titulo = `${mesNumero}  ${anio}`;
  //   return titulo;
  // });
  /**
   * si la fecha que esta en repertorio tiene el mismo mes, se agrega a un array, sino, se muestra el siguiente objeto
   * 1. sacar el mes Repertorios
   * 2. crear un bucle donde i sea incrementable
   * 3. Repertorios[i].Fecha.split("-")[1]
   * 4. Si Repertorios[i].Fecha.split("-")[1] === Repertorios[i+1].Fecha.split("-")[1]
   * 5. Pushear las coincidencias en un array
   */
  // let MesArrays = [];
  // for (let i = 0; i < Repertorios.length; i++) {
  //   if (
  //     Repertorios[i].Fecha.split("-")[1] ===
  //     Repertorios[i + 1].Fecha.split("-")[1]
  //   ) {
  //     MesArrays.push(Repertorios[i]);
  //   }
  //   console.log(MesArrays);
  // }
  // return console.log(Repertorios);
});
</script>
