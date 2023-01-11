<template>
  <div class="q-m-sm flex justify-center">
    <q-list bordered separator style="max-width: 550px; width: 100%">
      <q-item-label header
        >Listado de Alumnos Retirados
        <q-icon name="format_list_numbered" />
      </q-item-label>

      <!-- Filtro -->

      <q-separator />

      <div v-for="(card, i) in Listado" :key="i" class="items">
        <q-slide-item
          :right-color="rightColor"
          @right="$router.push('/Detalles_Alumnos/' + card.id)"
          @slide="onSlide"
        >
          <template v-slot:right> Perfil </template>

          <q-item class="flex justify-between row">
            <q-item-section>
              <q-item-label class="text-weight-medium">
                <span>{{ card.nombre }} {{ card.apellido }}</span>
              </q-item-label>
              <q-item-label class="text-small">
                {{ card.instrumento }}
              </q-item-label>

              <q-item-label>
                <!-- <q-virtual-scroll
                  :items="card.grupo"
                  virtual-scroll-horizontal
                  v-slot="{ item, index }"
                >
                  <div :key="index" :class="item.class" class="q-pa-xs">
                    <q-badge top outline color="secondary" :label="item" />
                  </div>
                </q-virtual-scroll> -->
              </q-item-label>
            </q-item-section>
            <q-circular-progress
              :min="card.min"
              :max="card.totalClases"
              :value="card.presente"
              size="50px"
              :thickness="card.min"
              color="teal"
              track-color="grey-3"
            />

            <q-item-section side>
              <q-icon name="swipe_left" />
            </q-item-section>
          </q-item>
        </q-slide-item>
        <q-separator />
      </div>
      <!-- Card del alumno -->
    </q-list>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watchEffect } from "vue";
import {
  Mostrar_Listado_Inactivos,
  Mostrar_todo,
  ObtenerAsistencias,
} from "../firebase";
import { useQuasar } from "quasar";
import BuscarAlumnos from "../components/Buscar-Alumnos.vue";
import { useRouter } from "vue-router";
const $q = useQuasar();
const _l = ref([]);
let Listado = ref([]);
let text = ref("");
let timer;
let grupo = ref("");
let Alumnos = ref("");
const router = useRouter();
let filter = ref(router.currentRoute._rawValue.params.filter);
const eventEmittedFromChild = (res) => {
  if (res.length != 0) {
    Listado.value = res.map((e) => ({ ...e }));
    return Listado.value;
  } else {
    return cargar_alumnos();
  }
};
const cargar_alumnos = async () => {
  let algo = async (id) => {
    const obj = {};
    obj.presente = await ObtenerAsistencias(id).then((e) => e.presente);
    obj.ausente = await ObtenerAsistencias(id).then((e) => e.ausente);
    return { obj };
  };

  Listado.value = await Mostrar_Listado_Inactivos().then((elem) =>
    elem.map((e) => ({ ...e.data() }))
  );
  Listado.value.map((elem) =>
    algo(elem.id).then(
      (e) =>
        (elem.presente = e.obj.presente) &&
        (elem.ausente = e.obj.ausente) &&
        (elem.min = 0.22) &&
        (elem.totalClases = e.obj.ausente + e.obj.presente)
    )
  );

  return Listado.value;
};

const Funcion_Switch = async (res) => {
  Listado.value.length = 0;

  Alumnos.value = await Mostrar_Listado_Inactivos().then((elem) =>
    elem.map((e) => e.data()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
  Listado.value = await Alumnos.value
    .filter((elem) => elem.grupo.find((e) => e === res))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
  return router.push(`/Perfil_Alumnos/${res}`);
};

const Filtrar = async (res) => {
  Alumnos.value = await Mostrar_Listado_Inactivos().then((elem) =>
    elem.map((e) => e.data()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
  switch (res) {
    case "Orq":
      Funcion_Switch("Orquesta");
      break;
    case "Coro":
      Funcion_Switch("Coro");
      break;
    case "Ini2":
      Funcion_Switch("Iniciacion 2");
      break;
    case "Ini1":
      Funcion_Switch("Iniciacion 1");
      break;
    case "All":
      router.push(`/Perfil_Alumnos/All`);
      Listado.value.length = 0;
      Listado.value = await Mostrar_Listado_Inactivos().then((elem) =>
        elem
          .map((e) => e.data())
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
      );
      break;
    default:
      break;
  }
};

onMounted(async () => {
  await cargar_alumnos();
});
onBeforeUnmount(() => {
  clearTimeout(timer);
});
const slideRatio = ref({
  left: 0,
  right: 0,
});
const rightColor = computed(() =>
  slideRatio.value.right >= 2
    ? "green-10"
    : "green-" + (3 + Math.round(Math.min(3, slideRatio.value.right * 3)))
);
const onSlide = ({ side, ratio, isReset }) => {
  clearTimeout(timer);
  timer = setTimeout(
    () => {
      slideRatio.value[side] = ratio;
    },
    isReset === true ? 200 : void 0
  );
};
watchEffect(async () => {
  filter.value = grupo.value;
  grupo.value = filter.value;
  // await Filtrar(router.currentRoute._rawValue.params.filter);
  await Filtrar(filter.value);
});
</script>
