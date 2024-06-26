<template>
  <q-page class="flex flex-center">
    <q-form @submit.prevent="addInstrument" class="q-gutter-md">
      <q-card style="width: 85%">
        <q-card-section>
          <div class="text-h6">Agregar Nuevo Instrumento</div>
        </q-card-section>

        <q-card-section>
          <!-- Formulario para la información del instrumento -->
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
              :rules="[required, isUnique]"
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

          <!-- Subida de imágenes -->
          <q-uploader
            url="#"
            label="Agregar Imágenes"
            @added="onFilesAdded"
            :multiple="true"
            :hide-upload-button="true"
            :max-files="5"
          >
            <!-- Barra de progreso para la subida de archivos -->
            <template v-slot:progress="{ progress }">
              <q-linear-progress
                v-if="progress"
                :value="progress"
                rounded
                color="primary"
              ></q-linear-progress>
            </template>
          </q-uploader>
        </q-card-section>

        <q-card-section>
          <q-btn
            type="submit"
            label="Agregar Instrumento"
            color="primary"
            :loading="isLoading"
          ></q-btn>
        </q-card-section>

        <!-- Mostrar información del instrumento -->
        <q-card-section v-if="instrument.id">
          <InstrumentInfo
            :instrument="instrument"
            :qrCodeUrl="qrCodeUrl"
            @downloadQRCode="downloadQRCode"
          />
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { agregarInstrumento, subirFotos } from "../FirebaseService/database";
import QRCode from "qrcode";
import InstrumentInfo from "../components/InstrumentInfo.vue"; // Componente para mostrar la información del instrumento

export default {
  name: "AddInstrument",
  components: {
    InstrumentInfo,
  },
  setup() {
    // Datos reactivos
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
    const filesToUpload = ref([]);
    const isLoading = ref(false);

    // Función para generar un ID único
    const generateId = () => {
      instrument.value.id = Math.random().toString(36).substr(2, 9);
    };

    // Función para validar que el ID sea único
    const isUnique = (value) => {
      // Verifica si el ID ya existe en la base de datos
      // ...
      return true;
    };

    // Función para agregar un nuevo instrumento
    const addInstrument = async () => {
      try {
        isLoading.value = true; // Muestra el estado de carga
        // Registrar la información de texto en la colección ALMACEN
        await agregarInstrumento(instrument.value);
        // Subir las imágenes a Firebase Storage
        await subirFotos(instrument.value.id, filesToUpload.value);
        generateQRCode();
        isLoading.value = false; // Oculta el estado de carga
        // Muestra un mensaje de éxito
        this.$q.notify({
          type: "positive",
          message: "Instrumento agregado con éxito",
        });
      } catch (error) {
        isLoading.value = false; // Oculta el estado de carga
        // Muestra un mensaje de error
        this.$q.notify({
          type: "negative",
          message: `Error: ${error.message}`,
        });
      }
    };

    // Función para manejar la adición de archivos
    const onFilesAdded = (files) => {
      filesToUpload.value = files;
    };

    // Función para generar el QR code
    const generateQRCode = async () => {
      const url = `https://orquestasinfonicapuntacana.netlify.app/instruments/${instrument.value.id}`;
      try {
        qrCodeUrl.value = await QRCode.toDataURL(url, {
          width: 200,
          height: 200,
        });
      } catch (error) {
        console.error("Error generating QR Code", error);
        // Muestra un mensaje de error al usuario
        this.$q.notify({
          type: "negative",
          message: "Error al generar el QR Code",
        });
      }
    };

    // Función para descargar el QR code
    const downloadQRCode = () => {
      const link = document.createElement("a");
      link.href = qrCodeUrl.value;
      link.download = `${instrument.value.id}-qr.png`;
      link.click();
    };

    // Inicializa el ID del instrumento
    onMounted(() => {
      generateId();
    });

    return {
      // Exporta variables reactivas y funciones
      instrument,
      qrCodeUrl,
      filesToUpload,
      isLoading,
      generateId,
      isUnique,
      addInstrument,
      onFilesAdded,
      generateQRCode,
      downloadQRCode,
    };
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
