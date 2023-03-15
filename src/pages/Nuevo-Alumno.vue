<template>
  <div class="q-ma-sm">
    <!-- Formulario del alumno -->
    <q-form @submit="onSubmit" @reset="onReset" class="q-ma-md">
      <q-stepper
        v-model="step"
        ref="stepper"
        alternative-labels
        color="primary"
        animated
      >
        <q-step
          :name="1"
          title="Datos del Alumno"
          icon="create_new_folder"
          :done="step > 1"
        >
          <q-input
            class="col-5 q-mb-md"
            filled
            lazy-rules
            v-model="alumno.nombre"
            label="Nombre"
            placeholder="Nombre Completo"
            autofocus
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            class="col-5 q-mb-md"
            filled
            lazy-rules
            v-model="alumno.apellido"
            label="Apellido"
            placeholder="Apellidos Completos"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />

          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.nac"
            label="Año Nacimiento"
            placeholder="DD-MM-AAAA"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />

          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.sexo"
            label="Sexo"
            placeholder="Femenino/Masculino"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />

          <q-input
            filled
            class="col-5 q-mb-md"
            v-model="alumno.cedula"
            label="Cedula del Alumno"
            placeholder="Cedula del Alumno"
          />
          <q-input
            class="col-5 q-mb-md"
            filled
            lazy-rules
            v-model="alumno.tlf_alumno"
            label="Telefono"
            placeholder="Ingresa el Numero de telefono del alumno"
          />
        </q-step>
        <!-- Paso  2 INFORMACION DEL CENTRO EDUCATIVO O TRABAJO -->
        <q-step
          :name="2"
          title="Centro Educativo o Trabajo"
          icon="school"
          :done="step > 2"
        >
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.colegio_trabajo"
            label="Colegio/Trabajo"
            placeholder="Ingresa el Nombre de la Institución"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.tlf_colegio_trabajo"
            label="Telefono del Colegio/Trabajo"
            placeholder="Ingresa el numero de telefono del Colegio o Trabajo"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.direccion_colegio_trabajo"
            label="Direccion del Colegio/Trabajo"
            placeholder="Ingresa el numero de telefono del Colegio o Trabajo"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.horario_colegio_trabajo"
            label="Horario de salida del Colegio/Trabajo"
            placeholder="Ingresa el horario de salida del Colegio o Trabajo"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
        </q-step>
        <!-- paso 3 INFORMACION DE LOS PADRES-->
        <q-step
          :name="3"
          title="Informacion de los Padres"
          icon="family_restroom"
        >
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.madre"
            label="Nombre de la Madre"
            placeholder="Ingresa el Nombre de la Madre"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.tlf_madre"
            label="Telefono de la Madre"
            placeholder="Ingresa el Numero de telefono de la Madre"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.cedula_madre"
            label="Cedula de la Madre"
            placeholder="Cedula de la Madre"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.padre"
            label="Nombre de la Padre"
            placeholder="Ingresa el Nombre de la Padre"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.tlf_padre"
            label="Telefono del Padre"
            placeholder="Ingresa el Numero de telefono de la Padre"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.cedula_padre"
            label="Cedula del Padre"
            placeholder="Cedula del Padre"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            lazy-rules
            class="col-5 q-mb-md"
            v-model="alumno.direccion"
            label="Direccion"
            placeholder="Ingresa la Direccion donde vive el alumno"
            :rules="[(val) => (val && val.length > 0) || 'Campo Obligatorio']"
          />
          <q-input
            filled
            class="col-5 q-mb-md"
            v-model="alumno.tlf_emergencia"
            label="Telefono de Emergencia"
            placeholder="Ingresa un numero de emergencia"
          />
          <br />
          <q-input
            filled
            class="col-5 q-mb-md"
            v-model="alumno.email"
            label="E-mail"
            placeholder="Ingresa un correo electronico"
          />
          <q-toggle
            v-model="alumno.Termino_Redes_Sociales"
            label="Nos permite publicar en redes sociales y medios de comunicacion fotos o videos de su representado?"
          />
          <q-toggle
            v-model="alumno.Termino_Aporte_Mensual"
            label="Acepta pagar un aporte mensual a la Orquesta para gastos administrativos?"
          />
        </q-step>
        <q-step
          :name="4"
          title="Crear Alumno Nuevo"
          icon="person_add"
          class="fit row inline justify-center"
        >
          <q-btn
            class="col-5 q-mb-md"
            @click="registrarAlumno() && $router.push('/Home')"
            color="secondary"
            label="Registrar"
          />
        </q-step>
        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn
              v-if="step != 4"
              @click="$refs.stepper.next()"
              color="primary"
              :label="step > 3 ? 'Listo' : 'Siguiente'"
            />
            <q-btn
              v-if="step > 1"
              flat
              color="primary"
              @click="$refs.stepper.previous()"
              label="Atras"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </template>
      </q-stepper>
    </q-form>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useQuasar } from "quasar";
import { Crear_Alumnos, Salir } from "../firebase";
import moment from "moment";
import { useRouter } from "vue-router";
const step = ref(1);

const alumno = ref({
  nombre: "",
  apellido: "",
  nac: "",
  edad: "",
  sexo: "",
  cedula: "",
  tlf_alumno: "",
  grupo: ["Iniciacion 1"],
  colegio_trabajo: "",
  tlf_colegio_trabajo: "",
  direccion_colegio_trabajo: "",
  horario_colegio_trabajo: "",
  madre: "",
  cedula_madre: "",
  tlf_madre: "",
  padre: "",
  cedula_padre: "",
  tlf_padre: "",
  direccion: "",
  tlf_emergencia: "",
  email: "",
  Termino_Redes_Sociales: false,
  Termino_Aporte_Mensual: false,
  registro: moment().format("LLLL"),
  id: Date.now().toString(),
});
const $q = useQuasar();
const registrarAlumno = async () => {
  try {
    return await Crear_Alumnos(alumno.value)
      .then(() => {
        $q.notify({
          message: "Alumno Guardado",
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
        });
      })
      .then(onReset())
      .catch((error) => {
        $q.notify({
          message: "Hubo un error, Comprueba que los campos",
          color: "red-4",
          textColor: "white",
          icon: "cloud_done",
        });
      });
  } catch (error) {
    console.log(error);
  }
};
const onSubmit = () => {
  registrarAlumno();
};
const onReset = () => {
  alumno.value.nombre = null;
  alumno.value.apellido = null;
};
</script>
