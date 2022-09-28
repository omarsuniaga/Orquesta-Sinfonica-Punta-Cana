<template>
  <div class="q-px-lg q-pb-md">
    <q-timeline color="secondary">
      <q-timeline-entry heading :body="fecha" />

      <q-timeline-entry :title="titulo" :subtitle="fecha" :body="informacion">
        <div
          class="q-ma-xs flex justify-center"
          style="width: 100%; max-width: 700px; min-width: 140px"
        >
          <h6>Calidad de Sonido</h6>
          <q-slider
            v-model="CalidadSonido"
            :min="0"
            :max="5"
            color="green"
            thumb-size="35px"
            markers
          />
          <h6>Nivel del Vibrato</h6>
          <q-slider
            v-model="NivelVibrato"
            :min="0"
            :max="5"
            color="green"
            thumb-size="35px"
            markers
          />
        </div>
      </q-timeline-entry>

      <q-timeline-entry
        title="Event Title"
        subtitle="February 21, 1986"
        icon="delete"
        body="body"
      />

      <q-timeline-entry heading body="November, 2017" />

      <q-timeline-entry
        title="Event Title"
        subtitle="February 22, 1986"
        :body="informacion"
      />
    </q-timeline>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Nivel_Alumno } from "../data";
const id = useRouter().currentRoute._rawValue.params.id;
let titulo = "Indicadores";
let fecha = "Febrero del 2022";
let { CalidadSonido, NivelVibrato } = Nivel_Alumno();
const informacion =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

onMounted(async () => {
  return console.log(CalidadSonido);
});
</script>
