<template>
  <div class="container">
    <div class="flex q-ma-sm justify-center wrap">
      <div class="row">
        <div class="col-4 col-md">
          <q-input
            stack-label
            v-model="escala.tonalidad"
            label="Escala"
            :dense="dense"
            :rules="[(val) => val !== '' || 'Escribe algo']"
          />
        </div>
        <div class="col-3 col-md">
          <q-input
            stack-label
            v-model.number="escala.octava"
            label="Octava"
            :dense="dense"
            type="number"
            min="0"
            max="7"
            :rules="[(val) => (val >= 0 && val <= 8) || 'Numero entre 1 - 8']"
          />
        </div>
        <div class="col-3 col-md">
          <q-input
            stack-label
            v-model.number="escala.valoracion"
            label="Valoracion"
            :dense="dense"
            type="number"
            min="0"
            max="5"
            :rules="[(val) => (val >= 0 && val <= 5) || 'Numero entre 1 - 5']"
          />
        </div>
        <div class="col-2">
          <q-btn
            round
            color="secondary"
            icon="add"
            @click="add(escala.tonalidad, escala.octava, escala.valoracion)"
          />
        </div>
      </div>
    </div>
    <div>
      <ul v-for="item in escala" :key="item.id">
        {{
          item
        }}
      </ul>
    </div>
  </div>
  {{ id }}
</template>

<script setup>
import { ref } from "vue";

import {
  Buscar_Por_Fecha,
  Buscar_Alumno,
  Mostrar_Listado,
  Eventos_Calendario,
  Mostrar_todo,
  Lista_Ausentes,
  Lista_Presentes,
} from "../firebase";
import { useRouter } from "vue-router";
const id = useRouter().currentRoute._rawValue.params.id;
const dense = ref(false);
const escala = ref([]);

const add = (tonalidad, octava, valoracion) => {
  escala.value.push({ tonalidad, octava, valoracion });
  escala.value.tonalidad = "Gm";
  escala.value.octava = 0;
  escala.value.valoracion = 0;
  return escala.value;
};
</script>
