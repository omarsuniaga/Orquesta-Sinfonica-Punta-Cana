<template>
  <div class="q-m-sm flex justify-center">
    <q-list bordered separator style="max-width: 550px; width: 100%">
      <q-item-label header
        >Listado de Alumnos
        <q-icon name="format_list_numbered" />
      </q-item-label>
      <BuscarAlumnos
        :text="text"
        class="flex justify-center"
        style="min-width: 360px; width: 100%"
        @onFire="eventEmittedFromChild"
      ></BuscarAlumnos>
      <!-- Filtro -->
      <div
        class="justify-center q-my-sm flex row"
        style="min-width: 375px; width: 100%"
      >
        <q-btn-toggle
          class="col-auto flex justify-around"
          rounded
          v-model="grupo"
          spread
          no-caps
          toggle-color="primary"
          color="while"
          text-color="primary"
          :options="[
            { label: 'Inicio 1', value: 'Ini1' },
            { label: 'Inicio 2', value: 'Ini2' },
            { label: 'Coro', value: 'Coro' },
            { label: 'Orquesta', value: 'Orq' },
            { label: 'Todos', value: 'All' },
          ]"
        >
        </q-btn-toggle>
      </div>
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
                <q-virtual-scroll
                  :items="card.grupo"
                  virtual-scroll-horizontal
                  v-slot="{ item, index }"
                >
                  <div :key="index" :class="item.class" class="q-pa-xs">
                    <q-badge top outline color="secondary" :label="item" />
                  </div>
                </q-virtual-scroll>
              </q-item-label>
            </q-item-section>
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
import { Mostrar_Listado } from "../firebase";
import { useQuasar } from "quasar";
import BuscarAlumnos from "../components/Buscar-Alumnos.vue";
const $q = useQuasar();
let Listado = ref([]);
let text = ref("");
let timer;
let url = ref("https://placeimg.com/500/300/nature?t=" + Math.random());
let grupo = ref("");
let Alumnos = ref("");

const eventEmittedFromChild = (res) => {
  if (res.length != 0) {
    Listado.value = res.map((e) => ({ ...e, avatar: url.value }));
    return Listado.value;
  } else {
    return cargar_alumnos();
  }
};
const cargar_alumnos = async () => {
  Listado.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => ({ ...e.data(), avatar: url.value }))
  );
};

const Filtrar = async (res) => {
  Alumnos.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => e.data()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  );
  switch (res) {
    case "Orq":
      //Alumnos de la Orquesta
      Listado.value.length = 0;
      Listado.value = await Alumnos.value
        .filter((elem) => elem.grupo.find((e) => e === "Orquesta"))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));

      break;
    case "Coro":
      Listado.value.length = 0;
      Listado.value = await Alumnos.value
        .filter((elem) => elem.grupo.find((e) => e === "Coro"))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case "Ini2":
      Listado.value.length = 0;
      Listado.value = await Alumnos.value
        .filter((elem) => elem.grupo.find((e) => e === "Iniciacion 2"))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    case "Ini1":
      Listado.value.length = 0;
      Listado.value = await Alumnos.value
        .filter((elem) => elem.grupo.find((e) => e === "Iniciacion 1"))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      break;
    default:
    case "All":
      Listado.value.length = 0;
      Listado.value = await Mostrar_Listado().then((elem) =>
        elem
          .map((e) => e.data())
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
      );

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
  await Filtrar(grupo.value);
});
</script>
