<template>
  <div class="q-pa-md">
    <q-carousel
      animated
      v-model="slide"
      navigation
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
    >
      <q-carousel-slide
        v-for="(imagen, index) of carouselItems"
        :key="index"
        :name="index"
        :img-src="imagen.src"
      />
    </q-carousel>
    <div v-if="nivel === '0'">
      <subir-fotos :destino="destino" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storage, auth } from "../firebase";
import { ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
import SubirFotos from "./SubirFotos.vue";
import { useNivelStore } from "../stores/Niveles";
import { store } from "quasar/wrappers";
// const nivelStore = useNivelStore();
let nivel = ref(auth.currentUser.phoneNumber);
let destino = ref("Carrusel");
const slide = ref(1);
const autoplay = ref(true);
const carouselItems = ref([]);

onMounted(async () => {
  // Obtiene una referencia a la carpeta "images"
  const imagesRef = storageRef(storage, "Carrusel");

  try {
    // Obtiene una lista de todas las imágenes en la carpeta "images"
    const imageList = await listAll(imagesRef);
    for (const image of imageList.items) {
      const url = await getDownloadURL(image);
      carouselItems.value.push({
        src: url,
        alt: image.name,
      });
    }

    // Itera sobre la lista de imágenes y agrega cada una al carrusel
  } catch (error) {
    console.error(error);
  }
});
</script>
