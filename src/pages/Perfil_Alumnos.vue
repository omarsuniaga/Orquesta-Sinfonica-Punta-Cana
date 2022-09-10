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
      <q-separator />
      <div v-for="(card, i) in cards" :key="i" class="items">
        <q-slide-item
          :right-color="rightColor"
          @right="$router.push('/Detalles_Alumnos/' + card.id)"
          @slide="onSlide"
        >
          <template v-slot:right> Perfil </template>

          <q-item class="flex justify-between row">
            <q-item-section avatar>
              <q-avatar>
                <img
                  :src="card.avatar"
                  style="height: 240px; width: 240px"
                  draggable="false"
                />
                <template v-slot:loading>
                  <q-spinner-gears color="white" />
                </template>
              </q-avatar>
            </q-item-section>
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
      </div>
      <!-- Card del alumno -->
    </q-list>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
  watchEffect,
  inject,
} from "vue";
import { Mostrar_Listado } from "../firebase";
import { useQuasar } from "quasar";
import BuscarAlumnos from "../components/Buscar-Alumnos.vue";
const $q = useQuasar();
let Resultado_Busqueda = inject("Resultado_Busqueda");
let cards = ref([]);
let text = ref("");
let timer;
let url = ref("https://placeimg.com/500/300/nature?t=" + Math.random());

const eventEmittedFromChild = (res) => {
  if (res.length != 0) {
    cards.value = res.map((e) => ({ ...e, avatar: url.value }));
    return cards.value;
  } else {
    return cargar_alumnos();
  }
};
const cargar_alumnos = async () => {
  cards.value = await Mostrar_Listado().then((elem) =>
    elem.map((e) => ({ ...e.data(), avatar: url.value }))
  );
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
</script>
