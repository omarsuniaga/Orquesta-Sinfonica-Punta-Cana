<template>
  <q-page padding class="bg-grey-1">
    <q-card flat bordered class="my-card q-pa-md">
      <q-card-section>
        <!-- Información general del alumno -->
        <div class="q-gutter-md row items-center q-pa-none">
          <q-avatar size="100px">
            <img :src="alumno.avatar || defaultAvatar" alt="avatar" />
          </q-avatar>

          <div class="col">
            <div class="text-h5 q-mb-xs">
              {{ alumno.nombre }} {{ alumno.apellido }}
            </div>
            <div class="text-body2 text-grey">
              {{ alumno.grupo.join(", ") || "Sin grupos" }}
            </div>
            <div
              v-if="alumno.instrumento"
              class="text-body2 text-green q-mt-sm"
            >
              Toca el instrumento: {{ alumno.instrumento }}
            </div>
            <div v-else class="text-body2 text-red q-mt-sm">
              No toca un instrumento
            </div>
          </div>
          <!-- Botón para ver detalles -->
          <q-btn
            label="Editar"
            icon="mdi-information-outline"
            color="primary"
            @click="verDetalles"
          />
        </div>
      </q-card-section>
      <q-separator v-if="alumno" />

      <q-card-section>
        <q-btn
              label="Evaluar"
              icon="mdi-information-outline"
              color="secondary"
              @click="irEvaluacion"
            />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { obtenerAlumnosPorId } from "src/FirebaseService/database";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";


// Datos del alumno
const alumno = ref({
  nombre: "",
  apellido: "",
  grupo: [],
  instrumento: "",
  avatar: "",
});

const defaultAvatar = "https://cdn.quasar.dev/img/avatar.png";

// Inicializamos el router dentro del setup
  const route = useRoute(); // Para obtener el parámetro de la URL
  const id = ref(route.params.id); // ID del alumno
  const router = useRouter(); // Para hacer la navegación (redirección)

onMounted(() => {
   // Obtén el ID del alumno desde la URL
   cargarAlumno(id.value); // Llama a la función que obtiene los datos del alumno
  });

  // Función para cargar los datos de un alumno
  const cargarAlumno = async (id) => {
  alumno.value = await obtenerAlumnosPorId(id);
};

// Función para ver detalles del alumno
const verDetalles = () => {
  router.push(`/Alumnos/${id.value}/Detalles`);
};

// Funciones para manejar las evaluaciones
const irEvaluacion = () => {
  router.push(`/Alumnos/${id.value}/Evaluaciones`);
};
</script>

<style scoped>
.my-card {
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
}
</style>
