<template>
  <div>
    <q-carousel
      class="carousel"
      swipeable
      animated
      v-model="slide"
      thumbnails
      infinite
      :autoplay="autoplay"
      arrows
      transition-prev="slide-right"
      transition-next="slide-left"
      @mouseenter="autoplay = false"
      @mouseleave="autoplay = true"
      :style="[
        'background-size: cover',
        'background-position: center center',
        'background-repeat: no-repeat',
        'background-color: green',
      ]"
    >
      <q-carousel-slide
        width="150px"
        class="carousel-item"
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
import { ref, watchEffect, defineProps } from "vue";
import { storage, auth } from "../firebase";
import { ref as storageRef, listAll, getDownloadURL } from "firebase/storage";
import SubirFotos from "./SubirFotos.vue";
import { useNivelStore } from "../stores/Niveles";
let store = useNivelStore();
let nivel = ref(auth.currentUser.phoneNumber);
const slide = ref(1);
const autoplay = ref(true);
const carouselItems = ref([]);
const props = defineProps({
  mensaje: {
    type: String,
  },
});
let destino = ref(props.mensaje);
const getListImagen = () => {
  // Obtiene una referencia a la carpeta "images"
  const imagesRef = storageRef(storage, props.mensaje);
  // Obtiene una lista de todas las imágenes en la carpeta "images"
  listAll(imagesRef)
    .then((imageList) => {
      imageList.items.forEach((image) => {
        getDownloadURL(image)
          .then((url) => {
            carouselItems.value.push({
              src: url,
            });
            store.imageList = carouselItems.value;
          })
          .catch((error) => {
            console.error(error);
          });
      });
    })
    .catch((error) => {
      console.error(error);
    });
};
watchEffect(async () => {
  getListImagen();
});
</script>
<style></style>
