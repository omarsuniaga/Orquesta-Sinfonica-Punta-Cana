<template>
  <div>
    <form @submit.prevent="archivo($event)" enctype="multipart/form-data">
      <input type="file" @change="archivo($event)" />
      <img :src="imageUrl" />
      <button type="submit">Guardar</button>
    </form>
  </div>
</template>

<script setup>
//este componente permite subir la fotografia de los alumnos
import { reactive } from "vue";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// Create the file metadata
/** @type {any} */
const metadata = {
  contentType: "image/jpeg",
};
console.log("Aqui estamos");
let file = reactive(null);
let imageUrl = reactive(null);
const archivo = (e) => {
  file = e.target.files[0];
  const storageRef = ref(storage, "fotos/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  console.log(file, storage, uploadTask);
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("URL de descarga: " + downloadURL);
        newAlumno.foto = downloadURL;
        // imageUrl = downloadURL;
      });
    }
  );
};
</script>

<style lang="scss" scoped></style>
