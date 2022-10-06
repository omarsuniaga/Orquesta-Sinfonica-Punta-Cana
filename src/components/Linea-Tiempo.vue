<template>
  <div class="q-px-lg q-pb-md">
    <q-timeline color="secondary">
      <h5>Reseña</h5>
      <span>{{ informacion }}</span>
      <q-timeline-entry heading :body="fecha" />

      <q-timeline-entry :title="titulo" :subtitle="fecha">
        <div style="width: 100%; max-width: 700px; min-width: 140px">
          <div class="row flex justify-between">
            <div class="col-auto q-px-sm">
              <h6>Calidad de Sonido</h6>
              <q-slider
                v-model="CalidadSonido"
                :min="0"
                :max="5"
                color="green"
                thumb-size="35px"
                markers
                label
                label-always
                :disable="editable"
              />
            </div>
            <div class="col-auto q-px-sm">
              <h6>Nivel del Vibrato</h6>
              <q-slider
                v-model="NivelVibrato"
                :min="0"
                :max="5"
                color="green"
                thumb-size="35px"
                markers
                label
                label-always
                :disable="editable"
              />
            </div>
            <div class="col-auto q-px-ms">
              <h6>Nivel del Vibrato</h6>
              <q-slider
                v-model="NivelVibrato"
                :min="0"
                :max="5"
                color="green"
                thumb-size="35px"
                markers
                label
                label-always
                :disable="editable"
              />
            </div>
          </div>
        </div>
      </q-timeline-entry>

      <q-timeline-entry heading body="November, 2017" />

      <q-timeline-entry
        v-for="(item, index) in 7"
        :key="index"
        title="Event Title"
        subtitle="February 22, 1986"
        :body="informacion"
      />
    </q-timeline>
    {{ templat }}
    <q-btn> Crear Item</q-btn>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Nivel_Alumno } from "../data";
const props = defineProps({
  editable: Boolean,
});
const items = ref(["una", "dos", "tres"]);
const templat = ref(`
<q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
        :body="informacion"
      />
    </q-timeline>
`);
const id = useRouter().currentRoute._rawValue.params.id;
let titulo = "Diagnosticos";
let fecha = "Febrero del 2022";
let {
  CalidadSonido,
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
const informacion = `Este Alumno empezó el ${FechaRegistrado} en el nivel ${Nivel}, tiene ${TiempoTocando} ${Frase1}

  `;
const op1 = async (res) => {
  console.log((CalidadSonido = res));
};
onMounted(async () => {
  return;
});
</script>
