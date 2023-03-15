`
<template>
  <section class="ma-4">
    <form @submit.prevent="archivo($event)" enctype="multipart/form-data">
      <input class="bg-red-300" type="file" @change="archivo($event)" />
      <div v-if="loading">
        <q-spinner color="primary" size="3em" />
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { storage } from "../firebase";
import {
  ref as refe,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useQuasar } from "quasar";
const $q = useQuasar();
// Recibe propiedad del padre
const props = defineProps({
  destino: String,
});
/** @type {any} */
const metadata = {
  contentType: "image/jpeg",
};
let loading = ref(false);
let file = ref("");
const archivo = (e) => {
  file = e.target.files[0];
  const storageRef = refe(storage, props.destino + "/" + file.value.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Proceso de la carga " + progress + "% ");
      loading.value = true;
      switch (snapshot.state) {
        case "paused":
          console.log("Carga pausada");
          break;
        case "running":
          loading.value = false;
          $q.notify({
            message: "Imagen Guardada",
            color: "green-4",
            textColor: "white",
            icon: "save",
          });
          break;
      }
    },
    (error) => {
      switch (error.code) {
        case "storage/unauthorized":
          break;
        case "storage/canceled":
          break;
        case "storage/unknown":
          break;
      }
    },
    async () => {
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("URL de descarga: " + url);
      // imagen = downloadURL;
      // $emit("imagen");
    }
  );
};
</script>
