<template>
  <div class="q-mx-lg flex justify-center">
    <q-list bordered separator style="max-width: 350px">
      <q-item-label header>Listado de Alumnos</q-item-label>
      <q-separator />

      <q-intersection
        v-for="(card, i) in cards"
        :key="i"
        transition="flip-right"
        class="example-item"
      >
        <q-slide-item
          :right-color="rightColor"
          @right="$router.push('/Detalles_Alumnos/' + card.id)"
          @slide="onSlide"
        >
          <template v-slot:right> Perfil </template>

          <q-item>
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
              <span>{{ card.nombreCompleto }}</span>
              <q-item-label class="text-weight-medium">
                {{ card.instrumento }}
              </q-item-label>
              <q-item-label class="text-small">{{ card.grupo }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-slide-item>
      </q-intersection>
      <!-- Card del alumno -->
    </q-list>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { Mostrar_Listado } from "../firebase";
import { useQuasar } from "quasar";
const $q = useQuasar();

const cards = ref([]);
let timer;
let url = ref("https://placeimg.com/500/300/nature?t=" + Math.random());

onMounted(() => {
  Mostrar_Listado().then((elem) => {
    elem.map((e) =>
      cards.value.push({
        nombreCompleto: e.data().nombre + " " + e.data().apellido,
        id: e.data().id,
        avatar: e.data().img
          ? e.data().img
          : "https://placeimg.com/500/300/nature?t=" + Math.random(),
        grupo: e.data().grupo ? e.data().grupo : "Inicial",
        instrumento: e.data().instrumento ? e.data().instrumento : "Teoria",
      })
    );
  });
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

// function onLeft({ reset }) {
//   $q.notify("Eliminando Alumno");
//   $q.dialog({
//     title: "Confirm",
//     message: "Would you like to turn on the wifi?",
//     cancel: true,
//     persistent: true,
//   })
//     .onOk(() => {
//       // console.log('OK')
//     })
//     .onCancel(() => {
//       // console.log('Cancel')
//     })
//     .onDismiss(() => {
//       // console.log('I am triggered on both OK and Cancel')
//     });
// }

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
