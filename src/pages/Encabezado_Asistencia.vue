<template>
  <div class="q-my-sm col-12" style="min-width: 375px; width: 100%">
    <div class="justify-center flex">
      <div class="col-auto q-mx-sm">
        <q-btn-group>
          <q-btn color="blue-6" icon="today" @click="visible = !visible" />
          <q-btn
            color="blue-6"
            icon-right="save"
            @click="guardar"
            :disable="Presentes.length === 0"
          />
        </q-btn-group>
      </div>
      <div class="row">
        <BuscarAlumnos
          :text="text"
          style="width: 100%"
          @onFire="eventEmittedFromChild"
        ></BuscarAlumnos>
      </div>
    </div>
    <div class="justify-center flex row" style="min-width: 375px; width: 100%">
      <q-btn-toggle
        class="col-auto flex justify-around"
        v-model="grupo"
        rounded
        spread
        stack
        no-caps
        no-wrap
        toggle-color="primary"
        color="green"
        text-color="white"
        :options="[
          { label: 'Inicio 1', value: 'Iniciacion 1' },
          { label: 'Inicio 2', value: 'Iniciacion 2' },
          { label: 'Coro', value: 'Coro' },
          { label: 'Orquesta', value: 'Orquesta' },
        ]"
      >
      </q-btn-toggle>
    </div>
  </div>
</template>

<script setup>
// import SelectorFecha from "./SelectorFecha.vue";
// import SelectorGrupo from "./SelectorGrupo.vue";
import BuscarAlumnos from "src/components/Buscar-Alumnos.vue";
// import { useQuasar } from "quasar";
// import { useRouter } from "vue-router";
import { Asistencia_de_Hoy } from "../../firebase";
import moment from "moment";
import { ref } from "vue";

const date = ref(moment().format("YYYY-MM-DD"));
const hoy = ref(moment().format("YYYY-MM-DD"));
const visible = ref(false);
const grupo = ref("All");
const events = ref([]);

const guardar = async () => {
  let Array_Ausentes = Listado.value.map((e) => e.id);
  let Array_Presentes = Presentes.value.map((e) => e.id);
  let Fecha = date.value;
  let Grupo = grupo.value;
  await Asistencia_de_Hoy(Array_Presentes, Array_Ausentes, Fecha, Grupo)
    .then(() => {
      $q.notify({
        message: "Listado Guardado con exito",
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
      });
    })
    .catch((error) => {
      $q.notify({
        message: `Ha ocurrido un Error ${error}`,
        color: "red-4",
        textColor: "white",
        icon: "priority_high",
      });
    });
};
</script>
