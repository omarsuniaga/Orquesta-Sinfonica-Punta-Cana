<template>
  <div class="q-pa-md">
    <q-carousel
      animated
      v-model="slide"
      arrows
      navigation
      infinite
      autoplay
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
    >
      <q-carousel-slide
        v-for="(imagen, index) in imagenes"
        :key="index"
        :name="index"
        :img-src="imagen"
      />
    </q-carousel>
  </div>
</template>

<script setup>
import { Mostrar_Carrusel } from "src/firebase";
import { ref, watch, onMounted } from "vue";
let imagenes = ref([]);
onMounted(async () => {
  imagenes.value = await Mostrar_Carrusel();
  imagenes.value = imagenes.value.map((e) => e.url);
});
const navPos = ref("bottom");
const vertical = ref(false);
let arrows = ref(true);
let navigationPositions = ref([{ value: "bottom", label: "bottom (default)" }]);
let slide = ref(1);
let autoplay = ref(true);
watch(vertical, (val) => {
  navPos.value = val === true ? "right" : "bottom";
});
</script>
