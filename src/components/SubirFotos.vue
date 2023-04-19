`
<template>
  <q-item-section avatar class="full-width row inline  justify-start items-start content-start"
    style="transform: translateY(-100%);">
    <q-avatar size="35px">
      <input type="file" @change="FileChange($event)" ref="Input" hidden="true" />
      <img src="https://s3.amazonaws.com/ionic-marketplace/image-upload/icon.png" @click="$refs.Input.click()">
    </q-avatar>
  </q-item-section>
  <div class="loading"></div>
</template>

<script setup>
import { ref, defineProps } from "vue";
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
let loading = ref(false);
const $q = useQuasar();
// Recibe propiedad del padre
const props = defineProps({
  destino: String,
});
/** @type {any} */
const metadata = {
  contentType: "image/jpeg",
};
// Función para subir archivo
async function addNewImage(file) {
  const imagesRef = refe(storage, props.destino);
  const newImageRef = refe(imagesRef, file.name);
  await uploadBytes(newImageRef, file);
  const url = await getDownloadURL(newImageRef);
  store.addImagen(url);
  $q.notify({
    message: "Imagen Guardada",
    color: "green-4",
    textColor: "white",
    icon: "save",
  });
  console.log(url, 'URL');
  (url) ? loading = true : loading = false;
}
// Manejador de eventos para el cambio de archivo
function FileChange(event) {
  console.log('aqi');

  const files = event.target.files;
  for (const file of files) {
    addNewImage(file);
  }
}
</script>
<style>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* Define la animación de carga */
.loading-container .loading {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

/* Define la keyframe de la animación */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
