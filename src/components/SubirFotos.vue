`
<template>
  <section class="ma-4">
    <form @submit.prevent="archivo($event)" enctype="multipart/form-data">
      <input class="bg-red-300" type="file" @change="archivo($event)" />
      <button @click="$emit('increaseBy', 1)">Increase by 1</button>
    </form>
  </section>
</template>

<script setup>
import { reactive } from "vue";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
/** @type {any} */
const metadata = {
  contentType: "image/jpeg",
};

let file = reactive(null);
const archivo = (e) => {
  file = e.target.files[0];
  const storageRef = ref(storage, "Avatars/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Proceso de la carga " + progress + "% ");
      switch (snapshot.state) {
        case "paused":
          console.log("Carga pausada");
          break;
        case "running":
          console.log("Carga Completa");
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
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("URL de descarga: " + downloadURL);
        // imagen = downloadURL;
        // $emit("imagen");
      });
    }
  );
};
</script>
