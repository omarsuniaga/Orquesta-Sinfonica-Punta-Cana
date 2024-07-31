<script setup>
import { useRouter } from "vue-router";
import { reactive, onMounted } from "vue";
// import ArbolHabilidadesVue from "src/components/Arbol-Habilidades.vue";
// import LineaTiempo from "src/components/Linea-Tiempo.vue";
import {
  Buscar_Alumno,
  Actualizar_Alumno,
  Eliminar_Alumno,
  Mover_Alumnos,
  auth,
} from "../firebase";
import { Dialog, useQuasar } from "quasar";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import SubirFotos from "src/components/SubirFotos.vue";
import { QBtn, QUploader } from "quasar";
import CarruselImagenes from "src/components/Carrusel-imagenes.vue";
import { Cloudinary } from "@cloudinary/url-gen";

// import { useNivelStore } from "../stores/Niveles";
// const store = useNivelStore();
// const nivel = computed(() => store.nivel);
// console.log("🚀 ~ file: Detalles_Alumnos.vue:19 ~ store:", nivel.value);

const $q = useQuasar();
const id = useRouter().currentRoute._rawValue.params.id;
let _ = reactive({
  sexo: ["Masculino", "Femenino"],
  options: ["Orquesta", "Coro", "Iniciacion 2", "Iniciacion 1"],
  // nivel: auth.currentUser.phoneNumber,
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
  const imagesRef = ref(storage, _.avatar);
  const newImageRef = ref(imagesRef, file.name);
  await uploadBytes(newImageRef, file);
  const url = await getDownloadURL(newImageRef);
  _.imageUrl = url;
  Buscar_Alumno(id).then((elem) => {
    elem.avatar = url;
    elem.id = id;
    Actualizar_Alumno(elem);
    _.alumno.avatar = url;
  });

  $q.notify({
    message: "Imagen Guardada",
    color: "green-4",
    textColor: "white",
    icon: "save",
  });
}
// change format img

const cambiarFormatoImg = (url) => {};

// const fetchedImage = cldInstance
//   .image(_.alumno.avatar)
//   .setDeliveryType('fetch');

// console.log(fetchedImage.toURL());

// Manejador de eventos para el cambio de archivo
function onFileChange(event) {
  const files = event.target.files;
  for (const file of files) {
    addNewImage(file);
  }
}
//Cambiar Formato de la Fecha
function cambiarFormatoFecha1(fecha) {
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = fechaObj.getMonth() + 1;
  const anio = fechaObj.getFullYear();
  const hora = fechaObj.getHours();
  const minutos = fechaObj.getMinutes();

  // Agregar cero inicial si el mes o día es menor a 10
  const diaStr = dia < 10 ? `0${dia}` : dia;
  const mesStr = mes < 10 ? `0${mes}` : mes;
  const res = `${diaStr}-${mesStr}-${anio}`;
  return res;
}
function cambiarFormatoFecha2(fecha) {
  fecha = fecha.replace("/", "-");
  let fechaFormateada = fecha.replace(/\//g, "-");
  return fechaFormateada;
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
onMounted(async () => {
  mostrar_ficha(id);
});
const mostrar_ficha = (id) => {
  Buscar_Alumno(id).then((elem) => {
    _.alumno.id = elem.id;
    _.alumno.nombre = elem.nombre;
    _.alumno.apellido = elem.apellido;
    _.alumno.cedula = elem.cedula || "Vacio";
    _.alumno.avatar = elem.avatar
      ? elem.avatar
      : "https://www.asofiduciarias.org.co/wp-content/uploads/2018/06/sin-foto-300x300.png";
    _.alumno.fecInscripcion = cambiarFormatoFecha1(elem.registro) || "Vacio";
    _.alumno.nac = elem.nac || "Vacio";
    _.alumno.edad = calcularEdad(elem.nac) || "Vacio";
    _.alumno.sexo = elem.sexo || "Vacio";
    _.alumno.email = elem.email || "Vacio";
    _.alumno.tlf = elem.tlf || "Vacio";
    _.alumno.emergencia = elem.emergencia || "Vacio";
    _.alumno.colegio_trabajo = elem.colegio_trabajo || "Vacio";
    _.alumno.direccion_colegio_trabajo =
      elem.direccion_colegio_trabajo || "Vacio";
    _.alumno.horario_colegio_trabajo = elem.horario_colegio_trabajo || "Vacio";
    _.alumno.registro = elem.registro;
    _.alumno.direccion = elem.direccion || "Vacio";
    _.alumno.Termino_Aporte_Mensual = elem.Termino_Aporte_Mensual || "Vacio";
    _.alumno.Termino_Redes_Sociales = elem.Termino_Redes_Sociales || "Vacio";
    _.alumno.madre = elem.madre || "Vacio";
    _.alumno.cedula_madre = elem.cedula_madre || "Vacio";
    _.alumno.tlf_madre = elem.tlf_madre || "Vacio";
    _.alumno.padre = elem.padre || "Vacio";
    _.alumno.cedula_padre = elem.cedula_padre || "Vacio";
    _.alumno.tlf_padre = elem.tlf_padre || "Vacio";
    _.alumno.grupo = elem.grupo;
    _.alumno.instrumento = elem.instrumento || "Vacio";
  });
};

const guardar = async (alumno) => {
  await Actualizar_Alumno(alumno)
    .then(() => {
      $q.notify({
        message: "Cambios Realizados con exito",
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
      });
      _.editable = false;
    })
    .catch((error) => {
      $q.notify({
        message: "Hubo un error, Comprueba que los campos",
        color: "red-4",
        textColor: "white",
        icon: "cloud_done",
      });
    });
};
const eliminar = async (alumno) => {
  $q.dialog({
    title: "Confirmar",
    message: "Estas seguro que quieres eliminar este alumno?",
    cancel: true,
    persistent: true,
  })
    .onOk(() =>
      moverAlumnoAInactivos(alumno).then(() =>
        eliminarAlumno(id).then(() => router.replace({ path: "/" }))
      )
    )
    .onCancel(() => {
      console.log(">>>> Cancel");
    })
    .onDismiss(() => {});
};
const mostrar = () => {
  _.ver = !_.ver;
};
</script>
<template>
  <div class="q-ma-sm row justify-center bg-white" style="min-width: 375px">
    <q-card class="my-card">
      <CarruselImagenes
        :mensaje="_.destino"
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
            <img :src="_.alumno.avatar" @click="$refs.fileInput.click()" />
          </q-avatar>
          <div
            class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
          >
            <q-icon name="place" />
            {{ _.alumno.instrumento }}
          </div>
        </q-item-section>

        <div class="row no-wrap items-center">
          <div class="col text-h6 ellipsis">
            {{ _.alumno.nombre }} {{ _.alumno.apellido }}
          </div>
        </div>
        <div v-if="_.nivel === '0'" class="flex q-ma-sm justify-end wrap">
          <q-btn
            class="q-mx-xs"
            color="primary"
            icon="save"
            size="sm"
            @click="guardar(_.alumno)"
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
            @click="eliminar()"
          />
        </div>
        <div v-else></div>
        <q-rating v-model="_.stars" :max="5" size="32px" />
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
          @click="$router.push('/Calificacion_Alumno/' + _.alumno.id)"
          >Calificacion
        </q-btn>
      </q-card-actions>
      <q-separator />
      <main>
        <q-list bordered separator style="width: 100%">
          <q-card>
            <q-card-section>
              <q-input
                v-model="_.alumno.nombre"
                :disable="_.editable"
                label="Nombre del Alumno"
                stack-label
              />
              <q-input
                v-model="_.alumno.apellido"
                :disable="_.editable"
                label="Apellido "
                stack-label
              />
            </q-card-section>
            <q-card-section class="col-5 offset-md-1">
              <q-input
                v-model="_.alumno.madre"
                :disable="_.editable"
                label="Nombre de la Madre"
                stack-label
              />
              <q-input
                v-model="_.alumno.cedula_madre"
                :disable="_.editable"
                label="Cedula de la Madre"
                stack-label
              />
              <q-input
                v-model="_.alumno.tlf_madre"
                :disable="_.editable"
                label="Tlf de la Madre"
                stack-label
              />
            </q-card-section>
            <q-card-section class="col-5 offset-md-1">
              <q-input
                v-model="_.alumno.padre"
                :disable="_.editable"
                label="Nombre del Padre"
                stack-label
              />
              <q-input
                v-model="_.alumno.cedula_padre"
                :disable="_.editable"
                label="Cedula del Padre"
                stack-label
              />
              <q-input
                v-model="_.alumno.tlf_padre"
                :disable="_.editable"
                label="Telefono del Padre"
                stack-label
              />
            </q-card-section>
          </q-card>
          <q-separator />
          <q-input
            v-model="_.alumno.avatar"
            :disable="_.editable"
            label="URL del Avatar"
            stack-label
          />
        </q-list>
        <div class="row q-mx-lg bg-white">
          <div class="col-5">
            <q-input
              v-model="_.alumno.edad"
              :disable="_.editable"
              label="Edad"
              stack-label
            />
            <q-select
              v-model="_.alumno.sexo"
              label="sexo"
              :options="_.sexo"
              stack-label
              :disable="_.editable"
            />
            <q-input
              v-model="_.alumno.cedula"
              :disable="_.editable"
              label="Cedula"
              stack-label
            />
            <q-input
              v-model="_.alumno.nac"
              :disable="_.editable"
              label="Fecha de Nacimiento"
              stack-label
            />
            <q-input
              v-model="_.alumno.fecInscripcion"
              :disable="_.editable"
              label="Fecha de Inscripcion"
              stack-label
            />
            <q-input
              v-model="_.alumno.direccion"
              :disable="_.editable"
              label="Direccion de Vivienda"
              stack-label
            />
            <q-input
              v-model="_.alumno.tlf"
              :disable="_.editable"
              label="Telefono del Alumno"
              stack-label
            />
          </div>

          <div class="col-5 offset-md-1">
            <q-input
              v-model="_.alumno.email"
              :disable="_.editable"
              label="Email"
              stack-label
            />
            <q-input
              v-model="_.alumno.emergencia"
              :disable="_.editable"
              label="Telefono de Emergencia"
              stack-label
            />
            <q-input
              v-model="_.alumno.colegio_trabajo"
              :disable="_.editable"
              label="Donde Estudia o Trabaja?"
              stack-label
            />
            <q-input
              v-model="_.alumno.direccion_colegio_trabajo"
              :disable="_.editable"
              label="Direccion de la Institucion"
              stack-label
            />
            <q-input
              v-model="_.alumno.horario_colegio_trabajo"
              :disable="_.editable"
              label="Horario de Clases o Trabajo"
              stack-label
            />
          </div>
          <q-checkbox
            :disable="_.editable"
            v-model="_.alumno.Termino_Aporte_Mensual"
            val="teal"
            label="Acepta el Termino del Aporte Mensual"
            color="teal"
          />
          <q-checkbox
            :disable="_.editable"
            v-model="_.alumno.Termino_Redes_Sociales"
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
                v-model="_.alumno.grupo"
                multiple
                :options="_.options"
                use-chips
                stack-label
                label="Grupos"
                :disable="_.editable"
                color="purple-6"
              />
              <q-input
                color="purple-12"
                class="q-mx-sm"
                filled
                v-model="_.alumno.instrumento"
                :disable="_.editable"
                label="Instrumento / Interesado en:"
                stack-label
              />

              <div v-if="_.loading !== null">
                {{ _.loading }}
                <q-linear-progress :value="_.progress" />
                <q-spinner-hourglass color="primary" size="2em" />
                <q-tooltip :offset="[0, 8]">Subiendo</q-tooltip>
              </div>
              <q-btn
                round
                dense
                flat
                icon="send"
                @click="guardar(_.alumno)"
                :disable="_.editable"
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
