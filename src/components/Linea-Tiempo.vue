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
import { PROCESOS } from "../firebase";
const props = defineProps({
  editable: Boolean,
});
const id = useRouter().currentRoute._rawValue.params.id;
let meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
let body = ref();
let res = ref(null);
let {
  NivelVibrato,
  TiempoTocando,
  Instrumento,
  Fila,
  Atril,
  FechaRegistrado,
  Nivel,
  Grupo,
} = Nivel_Alumno();

let Frase1 =
  Grupo === "Orquesta"
    ? `tocando en la ${Grupo} el ${Instrumento}. Pertenece a la Fila de ${Fila} en el atril ${Atril} por su nivel`
    : Grupo === "Coro"
    ? `cantando en el ${Grupo}. Pertenece a la Fila de ${Fila}`
    : Grupo === "Iniciacion 1"
    ? `en las filas de ${Grupo}. Necesita mas tiempo para subir de nivel`
    : null;
const informacion = `Este Alumno empezó el ${FechaRegistrado} en el nivel ${Nivel}, tiene ${TiempoTocando} ${Frase1}`;
const op1 = async (res) => {
  console.log((CalidadSonido = res));
};
onMounted(async () => {
  // let { Repertorios } = await PROCESOS(id);
  console.log(await PROCESOS(id));

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
