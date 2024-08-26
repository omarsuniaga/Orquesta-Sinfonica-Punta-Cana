<template>
  <div class="q-pa-md">
    <h2 class="text-center text-primary q-mb-md">Grupos</h2>
    <div class="grid-container q-my-lg">
      <q-btn
        v-for="(grupo, index) in grupos"
        :key="index"
        @click="seleccion(grupo)"
        class="grid-item"
        color="primary"
        unelevated
        push
      >
        <div class="row items-center no-wrap">
          <q-icon :name="grupo ? 'group' : ''" />
          <div class="text-center">{{ grupo ? grupo : "Vacio" }}</div>
        </div>
      </q-btn>
    </div>
    <h2 class="text-center text-primary q-mb-md">Cátedras</h2>
    <div class="grid-container q-my-lg">
      <q-btn
        v-for="(instrumento, index) in instrumentos"
        :key="index"
        @click="seleccion(instrumento)"
        class="grid-item"
        color="primary"
        unelevated
      >
        <!-- icon de persona -->
        <q-icon :name="instrumento ? 'person' : ''" />
        <div>{{ instrumento }}</div>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { obtenerInstrumentosYAlumnos } from "../FirebaseService/database";
import { obtenerGruposYAlumnos } from "../FirebaseService/database";

const router = useRouter();
const instrumentos = ref([]);
const grupos = ref([]);
const catedra = ref(null);
onMounted(async () => {
  //obtenerGrupos
  const { grupos: fetchedGrupos } = await obtenerGruposYAlumnos();
  grupos.value = fetchedGrupos;
  //obtenerInstrumentos
  const { instrumentos: fetchedInstrumentos } =
    await obtenerInstrumentosYAlumnos();
  instrumentos.value = fetchedInstrumentos;
});
// seleccion

const seleccion = (catedra) => {
  router.push({ name: "ModuloAsistencia", params: { catedra } });
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(150px, 1fr)
  ); /* Ajusta automáticamente el tamaño */
  gap: 10px;
}

.grid-item {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.text-primary {
  color: #2c3e50; /* Color primario */
}
</style>
