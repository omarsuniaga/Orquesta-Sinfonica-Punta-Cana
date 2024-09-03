<script setup>
import { reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  obtenerAlumnosPorId,
  eliminarAlumno,
  actualizarAlumno,
  obtenerGruposYAlumnos,
} from "src/FirebaseService/database";
import { useQuasar } from "quasar";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../FirebaseService/constants";

// Instancias de router y Quasar
const route = useRoute();
const router = useRouter();
const $q = useQuasar();

// Obtener el ID de la ruta
const id = route.params.id;
// Estado reactivo
const state = reactive({
  grupo: [],
  destino: `galeria/${id}`,
  alumno: {
    start: 0, // Valor predeterminado
  },
  editable: false,
  imageUrl:
    "https://www.asofiduciarias.org.co/wp-content/uploads/2018/06/sin-foto-300x300.png",
  file: null,
});

// Función para cargar los detalles del alumno
async function cargarDetallesAlumno() {
  try {
    const alumno = await obtenerAlumnosPorId(id);
    if (alumno) {
      state.alumno = {
        ...alumno,
        start: alumno.start || 0, // Asegúrate de que 'start' siempre tenga un valor numérico
      };
      state.imageUrl = alumno.avatar || state.imageUrl;
    }
  } catch (error) {
    console.error("Error al cargar los datos del alumno:", error);
    $q.notify({
      message: "Error al cargar los datos del alumno",
      color: "red-4",
      textColor: "white",
      icon: "error",
    });
  }
}

// Función para eliminar el alumno
async function eliminar() {
  try {
    await eliminarAlumno(id);
    $q.notify({
      message: "Alumno eliminado exitosamente",
      color: "green-4",
      textColor: "white",
      icon: "delete",
    });
    router.push("/");
  } catch (error) {
    console.error("Error al eliminar el alumno:", error);
    $q.notify({
      message: "Error al eliminar el alumno",
      color: "red-4",
      textColor: "white",
      icon: "error",
    });
  }
}

// Función para subir una nueva imagen
async function addNewImage(file) {
  try {
    const imagesRef = storageRef(storage, `avatar/${id}`);
    await uploadBytes(imagesRef, file);
    const url = await getDownloadURL(imagesRef);
    state.imageUrl = url;

    await actualizarAlumno(id, { avatar: url });
    state.alumno.avatar = url;

    $q.notify({
      message: "Imagen guardada exitosamente",
      color: "green-4",
      textColor: "white",
      icon: "save",
    });
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    $q.notify({
      message: "Error al subir la imagen",
      color: "red-4",
      textColor: "white",
      icon: "error",
    });
  }
}

// Manejador de eventos para el cambio de archivo
function onFileChange(event) {
  const files = event.target.files;
  if (files.length) {
    addNewImage(files[0]);
  }
}

// Función para alternar el estado de edición
function mostrar() {
  state.editable = !state.editable;
}

//obtener listado de grupos
async function obtenerGrupos() {
  try {
    const { grupos } = await obtenerGruposYAlumnos();

    // Asegúrate de que 'grupos' es un array antes de asignarlo al estado
    state.grupos = Array.isArray(grupos) ? grupos : [];

    console.log("Grupos:", state.grupos);
  } catch (error) {
    console.error("Error al obtener los grupos:", error);
    $q.notify({
      message: "Error al obtener los grupos",
      color: "red-4",
      textColor: "white",
      icon: "error",
    });
  }
}

// Función para guardar cambios en el perfil del alumno
async function guardar() {
  try {
    await actualizarAlumno(id, state.alumno);
    $q.notify({
      message: "Cambios realizados con éxito",
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
    });
    state.editable = false;
  } catch (error) {
    console.error("Error al actualizar el alumno:", error);
    $q.notify({
      message: "Hubo un error, verifica los campos",
      color: "red-4",
      textColor: "white",
      icon: "error",
    });
  }
}

// Cargar los datos del alumno cuando se monta el componente
onMounted(() => {
  cargarDetallesAlumno();
  obtenerGrupos();
});
</script>

<template>
  <div class="q-ma-sm row justify-center bg-white" style="min-width: 375px">
    <q-card class="my-card">
      <q-card-section>
        <q-item-section
          avatar
          class="full-width row inline justify-center items-center content-center"
          style="transform: translateY(-50%)"
        >
          <q-avatar size="150px">
            <input type="file" @change="onFileChange" ref="fileInput" hidden />
            <img :src="state.imageUrl" @click="$refs.fileInput.click()" />
          </q-avatar>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <q-icon name="place" />
            {{ state.alumno.instrumento || "Sin instrumento" }}
          </div>
        </q-item-section>

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{ state.alumno.nombre }} {{ state.alumno.apellido }}
          </div>
        </div>

        <q-separator />

        <div class="flex q-ma-md justify-end row no-wrap">
          <q-btn
            class="q-mx-xs"
            color="primary"
            icon="save"
            size="sm"
            @click="guardar"
          />
          <q-btn
            class="q-mx-xs"
            color="orange-4"
            icon="edit_note"
            size="sm"
            @click="mostrar"
          />
          <q-btn
            class="q-mx-xs"
            color="red-4"
            icon="remove_circle"
            size="sm"
            @click="eliminar"
          />
        </div>

        <q-rating v-model="state.alumno.start" :max="5" size="32px" />

        <q-separator />
        <q-list bordered separator style="width: 100%">
          <div class="row q-col-gutter-x-md flex justify-between q-ma-sm">
            <div class="col-auto q-ma-sm row no-wrap">
              <q-select
                filled
                v-model="state.alumno.grupo"
                multiple
                :options="state.grupos"
                option-label="nombre"
                option-value="nombre"
                use-chips
                stack-label
                label="Grupos"
                :disable="state.editable"
                color="purple-6"
              />
              <q-input
                color="purple-12"
                class="q-mx-sm"
                filled
                v-model="state.alumno.instrumento"
                :disable="state.editable"
                label="Instrumento / Interesado en:"
                stack-label
              />
            </div>
          </div>
        </q-list>
        <q-list bordered separator style="width: 100%">
          <q-card>
            <q-card-section>
              <q-input
                v-model="state.alumno.nombre"
                :disable="state.editable"
                label="Nombre del Alumno"
                stack-label
              />
              <q-input
                v-model="state.alumno.apellido"
                :disable="state.editable"
                label="Apellido"
                stack-label
              />
            </q-card-section>

            <q-card-section class="col-5 offset-md-1">
              <q-input
                v-model="state.alumno.madre"
                :disable="state.editable"
                label="Nombre de la Madre"
                stack-label
              />
              <q-input
                v-model="state.alumno.cedula_madre"
                :disable="state.editable"
                label="Cédula de la Madre"
                stack-label
              />
              <q-input
                v-model="state.alumno.tlf_madre"
                :disable="state.editable"
                label="Teléfono de la Madre"
                stack-label
              />
            </q-card-section>

            <q-card-section class="col-5 offset-md-1">
              <q-input
                v-model="state.alumno.padre"
                :disable="state.editable"
                label="Nombre del Padre"
                stack-label
              />
              <q-input
                v-model="state.alumno.cedula_padre"
                :disable="state.editable"
                label="Cédula del Padre"
                stack-label
              />
              <q-input
                v-model="state.alumno.tlf_padre"
                :disable="state.editable"
                label="Teléfono del Padre"
                stack-label
              />
            </q-card-section>
          </q-card>

          <q-separator />

          <q-input
            v-model="state.alumno.avatar"
            :disable="state.editable"
            label="URL del Avatar"
            stack-label
          />
        </q-list>

        <div class="row q-mx-lg bg-white">
          <div class="col-5">
            <q-input
              v-model="state.alumno.edad"
              :disable="state.editable"
              label="Edad"
              stack-label
            />
            <q-select
              v-model="state.alumno.sexo"
              label="Sexo"
              :options="['Masculino', 'Femenino']"
              stack-label
              :disable="state.editable"
            />
            <q-input
              v-model="state.alumno.cedula"
              :disable="state.editable"
              label="Cédula"
              stack-label
            />
            <q-input
              v-model="state.alumno.nac"
              :disable="state.editable"
              label="Fecha de Nacimiento"
              stack-label
            />
            <q-input
              v-model="state.alumno.fecInscripcion"
              :disable="state.editable"
              label="Fecha de Inscripción"
              stack-label
            />
            <q-input
              v-model="state.alumno.direccion"
              :disable="state.editable"
              label="Dirección de Vivienda"
              stack-label
            />
            <q-input
              v-model="state.alumno.tlf"
              :disable="state.editable"
              label="Teléfono del Alumno"
              stack-label
            />
          </div>

          <div class="col-5 offset-md-1">
            <q-input
              v-model="state.alumno.email"
              :disable="state.editable"
              label="Email"
              stack-label
            />
            <q-input
              v-model="state.alumno.emergencia"
              :disable="state.editable"
              label="Teléfono de Emergencia"
              stack-label
            />
            <q-input
              v-model="state.alumno.colegio_trabajo"
              :disable="state.editable"
              label="Dónde Estudia o Trabaja?"
              stack-label
            />
            <q-input
              v-model="state.alumno.direccion_colegio_trabajo"
              :disable="state.editable"
              label="Dirección de la Institución"
              stack-label
            />
            <q-input
              v-model="state.alumno.horario_colegio_trabajo"
              :disable="state.editable"
              label="Horario de Clases o Trabajo"
              stack-label
            />
          </div>

          <q-checkbox
            :disable="state.editable"
            v-model="state.alumno.Termino_Aporte_Mensual"
            label="Acepta el Término del Aporte Mensual"
            color="teal"
          />
          <q-checkbox
            :disable="state.editable"
            v-model="state.alumno.Termino_Redes_Sociales"
            label="Acepta el Término de hacer pública cualquier foto o video en las redes sociales de nuestra institución"
            color="teal"
          />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.my-card {
  max-width: 600px;
  margin: 80px auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
/* ajustar fotos del perfil */
.q-avatar img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
</style>
