<script setup>
import { useRouter } from "vue-router";
import { reactive, onMounted, computed } from "vue";
import ArbolHabilidadesVue from "src/components/Arbol-Habilidades.vue";
import LineaTiempo from "src/components/Linea-Tiempo.vue";
import {
  Buscar_Alumno,
  Actualizar_Alumno,
  Eliminar_Alumno,
  Mover_Alumnos,
  auth,
} from "../firebase";
import { Dialog, useQuasar } from "quasar";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useNivelStore } from "../stores/Niveles";
// const store = useNivelStore();
// const nivel = computed(() => store.nivel);
// console.log("🚀 ~ file: Detalles_Alumnos.vue:19 ~ store:", nivel.value);

let nivel = reactive(auth.currentUser.phoneNumber);

/** @type {any} */
const metadata = {
  contentType: "image/jpeg",
};

const $q = reactive(useQuasar());
const id = useRouter().currentRoute._rawValue.params.id;
let sexo = reactive(["Masculino", "Femenino"]);
let options = reactive(["Orquesta", "Coro", "Iniciacion 2", "Iniciacion 1"]);
const alumno = reactive({});
let editable = reactive(false);
let progress = reactive(0);
var loading = reactive(null);
let file = reactive(null);

const archivo = (e) => {
  file = e.target.files[0];
  const storageRef = ref(storage, "Avatars/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      loading = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progress = loading;
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
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          imagen = downloadURL;
        })
        .then(
          () => {
            console.log("URL de descarga: " + imagen);
            alumno.avatar = imagen;
            guardar(alumno);
          },
          (error) => {
            console.log(error);
          }
        );
    }
  );
};
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

  console.log(
    `Han pasado ${anios} años, ${meses} meses, ${semanas} semanas, ${dias} días`
  );
  return {
    dias,
    semanas,
    meses,
    anios,
  };
}

function cambiarFormatoFecha(fecha) {
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = fechaObj.getMonth() + 1;
  const anio = fechaObj.getFullYear();
  const hora = fechaObj.getHours();
  const minutos = fechaObj.getMinutes();

  // Agregar cero inicial si el mes o día es menor a 10
  const diaStr = dia < 10 ? `0${dia}` : dia;
  const mesStr = mes < 10 ? `0${mes}` : mes;

  return `${diaStr}-${mesStr}-${anio}`;
}

// Ejemplo de uso
const fechaOriginal = "Sunday, September 4, 2022 9:54 PM";
const fechaNueva = cambiarFormatoFecha(fechaOriginal);

console.log(fechaNueva); // Output: "04-09-2022 21:54"

onMounted(async () => {
  mostrar_ficha(id);
});
const mostrar_ficha = (id) => {
  Buscar_Alumno(id).then((elem) => {
    alumno.id = elem.id;
    alumno.nombre = elem.nombre;
    alumno.apellido = elem.apellido;
    alumno.cedula = elem.cedula || "Vacio";
    alumno.avatar = elem.avatar || imagen;
    alumno.nac = elem.nac || "Vacio";
    alumno.edad = calcularEdad(elem.nac) || "Vacio";
    alumno.sexo = elem.sexo || "Vacio";
    alumno.email = elem.email || "Vacio";
    alumno.tlf = elem.tlf || "Vacio";
    alumno.emergencia = elem.emergencia || "Vacio";
    alumno.colegio_trabajo = elem.colegio_trabajo || "Vacio";
    alumno.direccion_colegio_trabajo =
      elem.direccion_colegio_trabajo || "Vacio";
    alumno.horario_colegio_trabajo = elem.horario_colegio_trabajo || "Vacio";
    alumno.registro = elem.registro;
    alumno.fecInscripcion = cambiarFormatoFecha(elem.registro) || "Vacio";
    alumno.direccion = elem.direccion || "Vacio";
    alumno.Termino_Aporte_Mensual = elem.Termino_Aporte_Mensual || "Vacio";
    alumno.Termino_Redes_Sociales = elem.Termino_Redes_Sociales || "Vacio";
    alumno.madre = elem.madre || "Vacio";
    alumno.cedula_madre = elem.cedula_madre || "Vacio";
    alumno.tlf_madre = elem.tlf_madre || "Vacio";
    alumno.padre = elem.padre || "Vacio";
    alumno.cedula_padre = elem.cedula_padre || "Vacio";
    alumno.tlf_padre = elem.tlf_padre || "Vacio";
    alumno.grupo = elem.grupo;
    alumno.instrumento = elem.instrumento || "Vacio";
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
      editable = true;
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
const eliminar = async () => {
  $q.dialog({
    title: "Confirmar",
    message: "Estas seguro que quieres eliminar este alumno?",
    cancel: true,
    persistent: true,
  })
    .onOk(() =>
      Mover_Alumnos(alumno).then(() =>
        Eliminar_Alumno(id).then(() => router.replace({ path: "/" }))
      )
    )
    .onCancel(() => {
      console.log(">>>> Cancel");
    })
    .onDismiss(() => {});
};
</script>
<template>
  <div class="q-ma-sm flex justify-center bg-white" style="min-width: 375px">
    <q-list bordered separator>
      <div v-if="nivel === '0'" class="flex q-ma-sm justify-end wrap">
        <q-btn
          class="q-mx-xs"
          color="primary"
          icon="save"
          size="sm"
          @click="guardar(alumno)"
        />
        <q-btn
          class="q-mx-xs"
          color="orange-4"
          icon="edit_note"
          size="sm"
          @click="editable = !editable"
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
      <q-item-label header class="q-m-sm">
        <q-card class="flex row">
          <q-avatar class="avatar">
            <img :src="alumno.avatar" />
          </q-avatar>

          <q-card-section>
            <q-card-section class="">
              <span
                class="text-h5 text-weight-bolder q-mx-md"
                style="width: 100%"
              >
                {{ alumno.nombre }} {{ alumno.apellido }}
              </span>
            </q-card-section>
            <q-card-section>
              <span
                class="flex justify-center text-subtitle2 q-mx-sm"
                style="width: 100%"
              >
                {{ alumno.instrumento }}
              </span>
            </q-card-section>
            <q-toolbar>{{ alumno.registro }} </q-toolbar>
          </q-card-section>
        </q-card>
        <q-space />
      </q-item-label>

      <q-separator />
      <!-- <ArbolHabilidades /> -->
      <q-separator />
      <LineaTiempo :editable="editable" />
      <q-separator />
      <div v-if="nivel === '0'" class="row q-mx-lg bg-white">
        <div class="col-5">
          <q-input
            v-model="alumno.edad"
            :disable="editable"
            label="Edad"
            stack-label
          />
          <q-select
            v-model="alumno.sexo"
            label="sexo"
            :options="sexo"
            stack-label
            :disable="editable"
          />
          <q-input
            v-model="alumno.cedula"
            :disable="editable"
            label="Cedula"
            stack-label
          />
          <q-input
            v-model="alumno.nac"
            :disable="editable"
            label="Fecha de Nacimiento"
            stack-label
          />
          <q-input
            v-model="alumno.fecInscripcion"
            :disable="editable"
            label="Fecha de Inscripcion"
            stack-label
          />
          <q-input
            v-model="alumno.direccion"
            :disable="editable"
            label="Direccion de Vivienda"
            stack-label
          />
          <q-input
            v-model="alumno.tlf"
            :disable="editable"
            label="Telefono del Alumno"
            stack-label
          />
        </div>

        <div class="col-5 offset-md-1">
          <q-input
            v-model="alumno.email"
            :disable="editable"
            label="Email"
            stack-label
          />
          <q-input
            v-model="alumno.emergencia"
            :disable="editable"
            label="Telefono de Emergencia"
            stack-label
          />
          <q-input
            v-model="alumno.colegio_trabajo"
            :disable="editable"
            label="Donde Estudia o Trabaja?"
            stack-label
          />
          <q-input
            v-model="alumno.direccion_colegio_trabajo"
            :disable="editable"
            label="Direccion de la Institucion"
            stack-label
          />
          <q-input
            v-model="alumno.horario_colegio_trabajo"
            :disable="editable"
            label="Horario de Clases o Trabajo"
            stack-label
          />
        </div>
        <q-checkbox
          :disable="editable"
          v-model="alumno.Termino_Aporte_Mensual"
          val="teal"
          label="Acepta el Termino del Aporte Mensual"
          color="teal"
        />
        <q-checkbox
          :disable="editable"
          v-model="alumno.Termino_Redes_Sociales"
          val="teal"
          label="Acepta el Termino hacer publica cualquier foto o video en las redes sociales de nuestra institucion "
          color="teal"
        />
      </div>
    </q-list>
    <q-separator />
    <q-list v-if="nivel === '0'" bordered separator style="width: 100%">
      <div class="row flex q-ma-lg">
        <div class="col-5">
          <q-input
            v-model="alumno.madre"
            :disable="editable"
            label="Nombre de la Madre"
            stack-label
          />
          <q-input
            v-model="alumno.cedula_madre"
            :disable="editable"
            label="Cedula de la Madre"
            stack-label
          />
          <q-input
            v-model="alumno.tlf_madre"
            :disable="editable"
            label="Tlf de la Madre"
            stack-label
          />
        </div>

        <div class="col-5 offset-md-1">
          <q-input
            v-model="alumno.padre"
            :disable="editable"
            label="Nombre del Padre"
            stack-label
          />
          <q-input
            v-model="alumno.cedula_padre"
            :disable="editable"
            label="Cedula del Padre"
            stack-label
          />
          <q-input
            v-model="alumno.tlf_padre"
            :disable="editable"
            label="Telefono del Padre"
            stack-label
          />
        </div>
      </div>
      <!-- <q-input
        v-model="alumno.avatar"
        :disable="editable"
        label="URL del Avatar"
        stack-label
      /> -->
    </q-list>
    <q-separator />
    <q-list v-if="nivel === '0'" bordered separator style="width: 100%">
      <div class="row q-col-gutter-x-md flex justify-between q-ma-sm">
        <div class="col-auto q-ma-sm row no-wrap">
          <q-select
            filled
            v-model="alumno.grupo"
            multiple
            :options="options"
            use-chips
            stack-label
            label="Grupos"
            :disable="editable"
            color="purple-6"
          />
          <q-input
            color="purple-12"
            class="q-mx-sm"
            filled
            v-model="alumno.instrumento"
            :disable="editable"
            label="Instrumento / Interesado en:"
            stack-label
          />
          <input class="bg-grey-2" type="file" @change="archivo($event)" />
          <div v-if="loading">
            {{ loading }}
            <q-linear-progress :value="progress" />
            <!-- <q-spinner-hourglass color="primary" size="2em" />
            <q-tooltip :offset="[0, 8]">Subiendo</q-tooltip> -->
          </div>
          <q-btn
            round
            dense
            flat
            icon="send"
            @click="guardar(alumno)"
            :disable="editable"
          />
        </div>
      </div>
    </q-list>
    <div>
      <!-- @click="$router.push('/Detalles_Alumnos/' + item.id)" -->
      <q-btn to="/Calificacion_Alumno/">Calificacion</q-btn>
    </div>
  </div>
</template>

<style>
.avatar {
  width: 200px;
  height: 200px;
}
</style>
