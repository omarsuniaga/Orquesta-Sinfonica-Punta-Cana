<template>
  <div class="q-ma-sm flex justify-center" style="min-width: 375px">
    <q-list bordered separator>
      <q-item-label header class="">
        <span class="text-h5 col-auto" style="width: 100%"
          >{{ alumno.nombre }} {{ alumno.apellido }}</span
        >
        <div class="flex justify-around">
          <q-btn
            class=""
            color="primary"
            icon="save"
            size="md"
            @click="guardar(alumno)"
          />
          <q-btn
            class=""
            color="orange-4"
            icon="edit_note"
            size="md"
            @click="editable = !editable"
          />
          <q-btn
            class=""
            color="red-4"
            icon="remove_circle"
            size="md"
            @click="eliminar()"
          />
        </div>
      </q-item-label>

      <q-separator />
      <div class="row q-mx-lg">
        <div class="col-5">
          <q-input
            v-model="alumno.cedula"
            :disable="editable"
            label="Cedula"
            stack-label
          />
          <q-input
            v-model="alumno.edad"
            :disable="editable"
            label="Edad"
            stack-label
          />
          <q-input
            v-model="alumno.nac"
            :disable="editable"
            label="Fecha de Nacimiento"
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
    <span>Padres</span>
    <q-list bordered separator style="width: 100%">
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
    </q-list>
    <span>Datos Adicionales</span>
    <q-list bordered separator style="width: 100%">
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
          <q-btn
            round
            dense
            flat
            icon="send"
            @click="guardar(alumno) && $router.push('/Perfil_Alumnos')"
            :disable="editable"
          />
        </div>
      </div>
      <div class="col-12 q-m-sm">
        <q-file
          :disable="editable"
          filled
          bottom-slots
          v-model="model"
          label="Label"
          counter
          max-files="12"
        >
          <template v-slot:before>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
            </q-avatar>
          </template>

          <template v-slot:append>
            <q-icon
              v-if="model !== null"
              name="close"
              @click.stop.prevent="model = null"
              class="cursor-pointer"
            />
            <q-icon name="create_new_folder" @click.stop.prevent />
          </template>
          <template v-slot:after>
            <q-btn round dense flat icon="send" />
          </template>
        </q-file>
      </div>
    </q-list>
    <q-separator />

    <q-separator />
    <ArbolHabilidades />
    <LineaTiempo />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import ArbolHabilidadesVue from "src/components/Arbol-Habilidades.vue";
import LineaTiempo from "src/components/Linea-Tiempo.vue";
import {
  Buscar_Alumno,
  Actualizar_Alumno,
  Eliminar_Alumno,
  Mover_Alumnos,
} from "../firebase";
import { useRouter } from "vue-router";
import { Dialog, useQuasar } from "quasar";
import router from "src/router";
import ArbolHabilidades from "src/components/Arbol-Habilidades.vue";
const $q = reactive(useQuasar());
const url = ref("https://placeimg.com/500/300/nature?t=" + Math.random());
const id = useRouter().currentRoute._rawValue.params.id;
const alumno = reactive({});
let editable = ref(false);
let model = ref(null);
let value = ref(3);
let options = ref(["Orquesta", "Coro", "Iniciacion 2", "Iniciacion 1"]);
onMounted(() => {
  Buscar_Alumno(id).then((elem) => {
    alumno.id = elem.id;
    alumno.nombre = elem.nombre;
    alumno.apellido = elem.apellido;
    alumno.cedula = elem.cedula || "Vacio";
    alumno.nac = elem.nac || "Vacio";
    alumno.edad = elem.edad || "Vacio";
    alumno.email = elem.email || "Vacio";
    alumno.tlf = elem.tlf || "Vacio";
    alumno.emergencia = elem.emergencia || "Vacio";
    alumno.colegio_trabajo = elem.colegio_trabajo || "Vacio";
    alumno.direccion_colegio_trabajo =
      elem.direccion_colegio_trabajo || "Vacio";
    alumno.horario_colegio_trabajo = elem.horario_colegio_trabajo || "Vacio";
    alumno.registro = elem.registro;
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
});
const body = `Aqui va una breve descripcion del progreso del alumno, aun esta deshabilitada y esta en etapa de desarrollo`;

const guardar = async (alumno) => {
  await Actualizar_Alumno(alumno)
    .then(() => {
      $q.notify({
        message: "Cambios Realizados con exito",
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
      });
      editable.value = true;
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
    .onDismiss(() => {
      // console.log("I am triggered on both OK and Cancel");
    });
};
//Input tipo grupo: Iniciacion 1, Teoria y Solfeo, Coro, Orquesta
//Input de instrumento:
//Boton para Crear Entradas al Historico
//input para subir imagen de perfil
</script>
