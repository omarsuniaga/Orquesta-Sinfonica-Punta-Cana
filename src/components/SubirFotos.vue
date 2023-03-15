`
<template>
  <section class="ma-4">
    <form @submit.prevent="onFileChange($event)" enctype="multipart/form-data">
      <input class="bg-red-300" type="file" @change="onFileChange($event)" />
    </form>
  </section>
</template>

<script setup>
import { reactive, defineProps } from "vue";
import { storage } from "../firebase";
import { useNivelStore } from "../stores/Niveles";
import {
  ref as refe,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { useQuasar } from "quasar";
const store = useNivelStore();
const $q = useQuasar();
// Recibe propiedad del padre
const props = defineProps({
  destino: String,
});
/** @type {any} */
const metadata = {
  contentType: "image/jpeg",
};
let file = reactive("");
// Función para subir archivo
async function addNewImage(file) {
  const imagesRef = refe(storage, "Carrusel");
  const newImageRef = refe(imagesRef, file.name);
  await uploadBytes(newImageRef, file);

  const url = await getDownloadURL(newImageRef);
  store.addImagen(url, file.name);
  $q.notify({
    message: "Imagen Guardada",
    color: "green-4",
    textColor: "white",
    icon: "save",
  });
}
// Manejador de eventos para el cambio de archivo
function onFileChange(event) {
  const files = event.target.files;
  for (const file of files) {
    addNewImage(file);
  }
}
</script>
