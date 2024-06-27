<template>
  <q-item-section
    avatar
    class="full-width row inline justify-start items-start content-start"
    style="transform: translateY(-100%)"
  >
    <q-avatar size="35px">
      <input
        type="file"
        @change="fileChange"
        ref="input"
        hidden="true"
        multiple
      />
      <img
        src="https://s3.amazonaws.com/ionic-marketplace/image-upload/icon.png"
        @click="$refs.input.click()"
      />
    </q-avatar>
  </q-item-section>
  <div v-if="loading" class="loading-container">
    <div class="loading"></div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storage } from "../FirebaseService/constants";
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { useQuasar } from "quasar";

const loading = ref(false);
const $q = useQuasar();
const input = ref(null);

const props = defineProps({
  destino: String,
});

const emit = defineEmits(["imageUploaded"]);

const metadata = {
  contentType: "image/jpeg",
};

async function addNewImage(file) {
  const imagesRef = storageRef(storage, `${props.destino}/${file.name}`);
  try {
    loading.value = true;
    await uploadBytes(imagesRef, file, metadata);
    const url = await getDownloadURL(imagesRef);
    console.log("Imagen subida:", url);
    emit("imageUploaded", url);
    $q.notify({
      message: "Imagen Guardada",
      color: "green-4",
      textColor: "white",
      icon: "save",
    });
    loading.value = false;
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    $q.notify({
      message: "Error al guardar imagen",
      color: "red-5",
      textColor: "white",
      icon: "error",
    });
    loading.value = false;
  }
}

function fileChange(event) {
  const files = event.target.files;
  for (const file of files) {
    addNewImage(file);
  }
}
</script>

<style scoped>
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

.loading {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
