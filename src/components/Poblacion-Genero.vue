<template>
  <div class="q-ma-md">
    <q-card class="my-card">
      <q-card-section class="">
        <div class="text-h6">Poblacion de generos</div>
        <div class="text-subtitle2">
          <span v-if="(sexoCount['Vacio'] = 0)"
            >Vacio:
            {{ sexoCount["Vacio"] }}
          </span>
          <q-img src="../../src/assets/chica.png" :ratio="1" width="30px" />
          {{ sexoCount["Femenino"] }}
          <q-img src="../../src/assets/chico.png" :ratio="1" width="30px" />
          {{ sexoCount["Masculino"] }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import _ from "lodash";
import { getAlumnos } from "../firebase";
let alumnos = ref([]);
const sexoCount = computed(() => {
  let genre = _.countBy(alumnos.value, "sexo");
  return genre;
});

onMounted(() => {
  getAlumnos().then((res) => {
    return (alumnos.value = res);
  });
});
</script>
