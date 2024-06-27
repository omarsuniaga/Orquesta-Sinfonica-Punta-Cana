<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card style="width: 85%">
      <q-card-section>
        <div class="text-h6">Detalles del Instrumento</div>
      </q-card-section>

      <!-- agregar una caja de texto -->
      <q-card-section>
        <q-input
          outlined
          v-model="search"
          placeholder="Buscar..."
          dense
          clearable
          @clear="search = ''"
        />
      </q-card-section>
      <!-- agregar boton buscar -->
      <q-card-section>
        <q-btn
          color="primary"
          label="Buscar"
          @click="fetchInstrument"
          :disable="search.length === 0"
        />
      </q-card-section>

      <q-card-section>
        <div v-if="loading">Cargando...</div>
        <div v-else>
          <div><strong>Instrumento:</strong> {{ instrument.name }}</div>
          <div><strong>Tamaño:</strong> {{ instrument.size }}</div>
          <div>
            <strong>Modelo - Serial:</strong> {{ instrument.modelSerial }}
          </div>
          <div><strong>Identificador - ID:</strong> {{ instrument.id }}</div>
          <div><strong>Estado:</strong> {{ instrument.state }}</div>
          <div><strong>Asignación:</strong> {{ instrument.assignedTo }}</div>
          <div><strong>Accesorios:</strong> {{ instrument.accessories }}</div>
          <div>
            <strong>Fecha de Registro:</strong>
            {{ instrument.registrationDate }}
          </div>

          <div v-if="instrument.imageUrls.length">
            <strong>Imágenes:</strong>
            <ul v-for="(url, index) in instrument.imageUrls" :key="index">
              <img :src="url" alt="Instrumento" style="width: 100%" />
            </ul>
          </div>

          <div v-if="instrument.qrCodeUrl">
            <strong>QR Code:</strong>
            <img :src="instrument.qrCodeUrl" alt="QR Code" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseService/constants";
import { useQuasar } from "quasar";
// obtener el parametro de la ruta

const route = useRoute();
const $q = useQuasar();
const instrument = ref(null);
const search = ref("");
const loading = ref(true);
// observar el campo de texto, si esta vacio, borrar busquedad, si esta lleno buscar

const fetchInstrument = async () => {
  const docRef = doc(db, "ALMACEN", search.value);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      instrument.value = docSnap.data();
    } else {
      $q.notify({
        type: "negative",
        message: "No se encontraron datos del instrumento",
      });
    }
  } catch (error) {
    console.error("Error fetching instrument:", error);
    $q.notify({
      type: "negative",
      message: `Error al obtener los datos: ${error.message}`,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // (search.value?.length || search.value === "") && (await fetchInstrument());
});
</script>

<style scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
