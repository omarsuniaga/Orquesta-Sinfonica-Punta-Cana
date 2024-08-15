<script setup>
import { useRouter } from "vue-router";
import { reactive, onMounted } from "vue";
import {
  moverAlumnoAInactivos,
  Buscar_Alumno,
  Actualizar_Alumno,
  obtenerConfiguraciones,
} from "src/FirebaseService/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useQuasar } from "quasar";
import CarruselImagenes from "src/components/Carrusel-imagenes.vue";
import { storage } from "../FirebaseService/constants";
const $q = useQuasar();
const router = useRouter();
const id = router.currentRoute.value.params.id;

let state = reactive({
  sexo: ["Masculino", "Femenino"],
  options: [],
  nivel: "0",
  alumno: {},
  editable: true,
  file: null,
  loading: null,
  imagen: "",
  imageUrl:
    "https://www.asofiduciarias.org.co/wp-content/uploads/2018/06/sin-foto-300x300.png",
  destino: `galeria/${id}`,
  avatar: `avatar/${id}`,
  stars: 2,
  ver: true,
});

/** @type {any} */
const metadata = {
  contentType: "image/jpeg",
};

// Función para subir archivo
async function addNewImage(file) {
  try {
    const imagesRef = storageRef(storage, state.avatar);
    const newImageRef = storageRef(imagesRef, file.name);
    await uploadBytes(newImageRef, file);
    const url = await getDownloadURL(newImageRef);
    state.imageUrl = url;

    const alumno = await Buscar_Alumno(id);
    if (alumno) {
      alumno.avatar = url;
      await Actualizar_Alumno(alumno);
      state.alumno.avatar = url;

      $q.notify({
        message: "Imagen Guardada",
        color: "green-4",
        textColor: "white",
        icon: "save",
      });
    }
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
  for (const file of files) {
    addNewImage(file);
  }
}

// Cambiar Formato de la Fecha
function cambiarFormatoFecha1(fecha) {
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = fechaObj.getMonth() + 1;
  const anio = fechaObj.getFullYear();
  // Agregar cero inicial si el mes o día es menor a 10
  const diaStr = dia < 10 ? `0${dia}` : dia;
  const mesStr = mes < 10 ? `0${mes}` : mes;
  return `${diaStr}-${mesStr}-${anio}`;
}

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const partesFecha = fechaNacimiento.split("-"); // separa la fecha en partes
  const fechaNac = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]); // crea un objeto Date a partir de las partes
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }

  return edad;
};

function calcularTiempoTranscurrido(desdeFecha) {
  const fechaInicial = Date.parse(desdeFecha);
  const fechaActual = new Date();
  const diferenciaEnMilisegundos = fechaActual - fechaInicial;
  const segundos = Math.floor(diferenciaEnMilisegundos / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  const semanas = Math.floor(dias / 7);
  const meses = Math.floor(semanas / 4);
  const anios = Math.floor(meses / 12);

  return {
    dias,
    semanas,
    meses,
    anios,
  };
}

// Mostrar datos del alumno
const mostrar_ficha = async (id) => {
  try {
    const elem = await Buscar_Alumno(id);
    if (elem) {
      state.alumno = {
        ...state.alumno,
        id: elem.id,
        nombre: elem.nombre || "Vacio",
        apellido: elem.apellido || "Vacio",
        cedula: elem.cedula || "Vacio",
        avatar: elem.avatar || state.imageUrl,
        fecInscripcion: cambiarFormatoFecha1(elem.registro) || "Vacio",
        nac: elem.nac || "Vacio",
        edad: calcularEdad(elem.nac) || "Vacio",
        sexo: elem.sexo || "Vacio",
        email: elem.email || "Vacio",
        tlf: elem.tlf || "Vacio",
        emergencia: elem.emergencia || "Vacio",
        colegio_trabajo: elem.colegio_trabajo || "Vacio",
        direccion_colegio_trabajo: elem.direccion_colegio_trabajo || "Vacio",
        horario_colegio_trabajo: elem.horario_colegio_trabajo || "Vacio",
        registro: elem.registro,
        direccion: elem.direccion || "Vacio",
        Termino_Aporte_Mensual: elem.Termino_Aporte_Mensual || "Vacio",
        Termino_Redes_Sociales: elem.Termino_Redes_Sociales || "Vacio",
        madre: elem.madre || "Vacio",
        cedula_madre: elem.cedula_madre || "Vacio",
        tlf_madre: elem.tlf_madre || "Vacio",
        padre: elem.padre || "Vacio",
        cedula_padre: elem.cedula_padre || "Vacio",
        tlf_padre: elem.tlf_padre || "Vacio",
        grupo: elem.grupo || [],
        instrumento: elem.instrumento || "Vacio",
      };
    }
  } catch (error) {
    console.error("Error al obtener los datos del alumno:", error);
    $q.notify({
      message: "Error al cargar los datos del alumno",
      color: "red-4",
      textColor: "white",
      icon: "error",
    });
  }
};

// Guardar cambios en el perfil del alumno
const guardar = async (alumno) => {
  try {
    await Actualizar_Alumno(alumno);
    $q.notify({
      message: "Cambios Realizados con éxito",
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
};

// Eliminar alumno
const eliminar = async (id) => {
  try {
    const dialog = $q.dialog({
      title: "Confirmar",
      message: "Estas seguro que quieres eliminar este alumno?",
      cancel: true,
      persistent: true,
    });

    dialog.onOk(async () => {
      await moverAlumnoAInactivos(id);
      router.replace({ path: "/" });
    });
    dialog.onCancel(() => {
      console.log("Cancelado");
    });
  } catch (error) {
    console.error("Error al eliminar el alumno:", error);
    $q.notify({
      message: "Error al eliminar el alumno",
      color: "red-4",
      textColor: "white",
      icon: "error",
    });
  }
};

const mostrar = () => {
  state.editable = !state.editable;
};

onMounted(async () => {
  state.options = await obtenerConfiguraciones();
  await mostrar_ficha(id);
});
</script>

<template>
  <div class="q-ma-sm row justify-center bg-white" style="min-width: 375px">
    <q-card class="my-card">
      <CarruselImagenes
        :mensaje="state.destino"
        class="col-12 col-sm-6 col-xl-6 col-md-6"
      />

      <q-card-section>
        <q-item-section
          avatar
          class="full-width row inline justify-center items-center content-center"
          style="transform: translateY(-50%)"
        >
          <q-avatar size="150px">
            <input
              class="bg-red-300"
              type="file"
              @change="onFileChange($event)"
              ref="fileInput"
              hidden="true"
            />
            <img :src="state.alumno.avatar" @click="$refs.fileInput.click()" />
          </q-avatar>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <q-icon name="place" />
            {{ state.alumno.instrumento }}
          </div>
        </q-item-section>

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{ state.alumno.nombre }} {{ state.alumno.apellido }}
          </div>
        </div>
        <div
          v-if="state.nivel === '0'"
          class="flex q-ma-md justify-end row no-wrap"
        >
          <q-btn
            class="q-mx-xs"
            color="primary"
            icon="save"
            size="sm"
            @click="guardar(state.alumno)"
          />
          <q-btn
            class="q-mx-xs"
            color="orange-4"
            icon="edit_note"
            size="sm"
            @click="mostrar()"
          />
          <q-btn
            class="q-mx-xs"
            color="red-4"
            icon="remove_circle"
            size="sm"
            @click="eliminar(id)"
          />
        </div>
        <div v-else></div>
        <q-rating v-model="state.stars" :max="5" size="32px" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="text-caption text-grey">
          <!-- <LineaTiempo /> -->
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn
          flat
          color="primary"
          @click="$router.push('/Calificacion_Alumno/' + state.alumno.id)"
          >Calificacion
        </q-btn>
      </q-card-actions>
      <q-separator />
      <main>
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
                label="Apellido "
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
                label="Cedula de la Madre"
                stack-label
              />
              <q-input
                v-model="state.alumno.tlf_madre"
                :disable="state.editable"
                label="Tlf de la Madre"
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
                label="Cedula del Padre"
                stack-label
              />
              <q-input
                v-model="state.alumno.tlf_padre"
                :disable="state.editable"
                label="Telefono del Padre"
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
              label="sexo"
              :options="state.sexo"
              stack-label
              :disable="state.editable"
            />
            <q-input
              v-model="state.alumno.cedula"
              :disable="state.editable"
              label="Cedula"
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
              label="Fecha de Inscripcion"
              stack-label
            />
            <q-input
              v-model="state.alumno.direccion"
              :disable="state.editable"
              label="Direccion de Vivienda"
              stack-label
            />
            <q-input
              v-model="state.alumno.tlf"
              :disable="state.editable"
              label="Telefono del Alumno"
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
              label="Telefono de Emergencia"
              stack-label
            />
            <q-input
              v-model="state.alumno.colegio_trabajo"
              :disable="state.editable"
              label="Donde Estudia o Trabaja?"
              stack-label
            />
            <q-input
              v-model="state.alumno.direccion_colegio_trabajo"
              :disable="state.editable"
              label="Direccion de la Institucion"
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
            val="teal"
            label="Acepta el Termino del Aporte Mensual"
            color="teal"
          />
          <q-checkbox
            :disable="state.editable"
            v-model="state.alumno.Termino_Redes_Sociales"
            val="teal"
            label="Acepta el Termino hacer publica cualquier foto o video en las redes sociales de nuestra institucion "
            color="teal"
          />
        </div>
        <q-list bordered separator style="width: 100%">
          <div class="row q-col-gutter-x-md flex justify-between q-ma-sm">
            <div class="col-auto q-ma-sm row no-wrap">
              <q-select
                filled
                v-model="state.alumno.grupo"
                multiple
                :options="state.options"
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

              <div v-if="state.loading !== null">
                {{ state.loading }}
                <q-linear-progress :value="state.progress" />
                <q-spinner-hourglass color="primary" size="2em" />
                <q-tooltip :offset="[0, 8]">Subiendo</q-tooltip>
              </div>
              <q-btn
                round
                dense
                flat
                icon="send"
                @click="guardar(state.alumno)"
                :disable="state.editable"
              />
            </div>
          </div>
        </q-list>
      </main>
    </q-card>
  </div>
</template>

<style>
.q-card {
  width: 100%;
  max-width: 100%;
}
</style>
