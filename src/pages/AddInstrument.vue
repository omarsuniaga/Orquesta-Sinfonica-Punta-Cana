<template>
  <q-page class="flex flex-center">
    <q-form @submit.prevent="addInstrument" class="q-gutter-md">
      <q-card style="width: 85%">
        <q-card-section>
          <div class="text-h6">Agregar Nuevo Instrumento</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model.trim="instrument.name"
            label="Instrumento"
            outlined
            required
          ></q-input>
          <q-input
            v-model.trim="instrument.size"
            label="Tamaño"
            outlined
            required
          ></q-input>
          <q-input
            v-model.trim="instrument.modelSerial"
            label="Modelo - Serial"
            outlined
            required
          ></q-input>

          <div class="row items-center q-gutter-sm">
            <q-btn
              @click="generateId"
              label="Generar ID"
              color="secondary"
            ></q-btn>
            <q-input
              v-model.trim="instrument.id"
              label="Identificador - ID"
              outlined
              required
            ></q-input>
          </div>

          <q-input
            v-model.trim="instrument.state"
            label="Estado"
            outlined
            required
          ></q-input>
          <q-input
            v-model.trim="instrument.assignedTo"
            label="Asignación"
            outlined
            required
          ></q-input>
          <q-input
            v-model.trim="instrument.accessories"
            label="Accesorios"
            outlined
            required
          ></q-input>

          <image-uploader
            :destino="`instruments/${instrument.id}`"
            @imageUploaded="onImageUploaded"
          ></image-uploader>
        </q-card-section>

        <q-card-section>
          <q-btn
            type="submit"
            label="Agregar Instrumento"
            color="primary"
          ></q-btn>
        </q-card-section>

        <q-card-section v-if="qrCodeUrl">
          <div>QR Code:</div>
          <img :src="qrCodeUrl" alt="QR Code" />
          <q-btn
            @click="downloadQRCode"
            label="Descargar QR"
            color="secondary"
          ></q-btn>
        </q-card-section>

        <q-card-section v-if="instrument.id">
          <div>
            URL: https://orquestasinfonicapuntacana.netlify.app/instruments/{{
              instrument.id
            }}
          </div>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import QRCode from "qrcode";
import ImageUploader from "../components/ImageUploaded.vue";
import {
  registrarInstrumento,
  actualizarInstrumento,
} from "../FirebaseService/database"; // Importa tus funciones

const $q = useQuasar();

const instrument = ref({
  name: "",
  size: "",
  modelSerial: "",
  id: "",
  state: "",
  assignedTo: "",
  accessories: "",
  registrationDate: new Date().toISOString(),
  imageUrls: [],
});

const qrCodeUrl = ref("");

const addInstrument = async () => {
  try {
    await registrarInstrumento(instrument.value);
    await generateQRCode(instrument.value.id);
    $q.notify({
      type: "positive",
      message: "Instrumento agregado con éxito",
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: `Error: ${error.message}`,
    });
  }
};

const onImageUploaded = async (url) => {
  instrument.value.imageUrls.push(url);
  try {
    await actualizarInstrumento(instrument.value.id, {
      imageUrls: instrument.value.imageUrls,
    });
    $q.notify({
      type: "positive",
      message: "Imagen actualizada",
    });
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    $q.notify({
      type: "negative",
      message: `Error al actualizar imágenes: ${error.message}`,
    });
  }
};

const generateQRCode = async (id) => {
  const url = `https://orquestasinfonicapuntacana.netlify.app/instruments/${id}`;
  try {
    qrCodeUrl.value = await QRCode.toDataURL(url, {
      width: 200,
      height: 200,
    });
    await actualizarInstrumento(id, { qrCodeUrl: qrCodeUrl.value });
  } catch (error) {
    console.error("Error generating QR Code", error);
  }
};

const downloadQRCode = () => {
  const link = document.createElement("a");
  link.href = qrCodeUrl.value;
  link.download = `${instrument.value.id}-qr.png`;
  link.click();
};

const generateId = () => {
  const id = Math.random().toString(36).substr(2, 9);
  instrument.value.id = id;
};
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
