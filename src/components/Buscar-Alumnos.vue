<template>
  <div class="col-auto" style="width: 65%">
    <q-input
      outlined
      bottom-slots
      v-model.trim="text"
      label="Buscar Alumnos"
      dense
      @keyup.enter="Buscar_Alumno_Nombre"
    >
      <template v-slot:append>
        <q-icon
          v-if="text !== ''"
          name="close"
          @click="text = ''"
          class="cursor-pointer"
        />
        <q-icon name="search" @click="Buscar_Alumno_Nombre" />
      </template>
    </q-input>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watchEffect } from "vue";
import { Buscar_Alumno_Nombre } from "../firebase";

let Resultado_Busqueda = ref([]);
const props = defineProps(["text"]);
let text = ref("");

watchEffect(async () => {
  if (text.value.length > 0) {
    Resultado_Busqueda.value = await Buscar_Alumno_Nombre(
      text.value.charAt(0).toLocaleUpperCase()
    ).then();
  } else {
    return (Resultado_Busqueda.value.length = 0);
  }
  console.log("Resultado_Busqueda.value", Resultado_Busqueda.value);
});
</script>
