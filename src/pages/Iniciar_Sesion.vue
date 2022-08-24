<template>
  <div class="q-pa-md fit row inline justify-center" style="max-width: 800px">
    <q-form
      @submit.prevent="onSubmit"
      @reset="onReset"
      class="q-gutter-md col-6"
    >
      <q-input
        filled
        v-model="username"
        type="text"
        label="Username"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Please type something']"
      />
      <q-input
        filled
        type="password"
        v-model="pass"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || 'Datos Incorrectos',
          (val) => validar(val) || 'Invalid characters',
        ]"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { ref } from "vue";
import { Entrar } from "../firebase";
const $q = useQuasar();
const router = useRouter();

const username = ref(null);
const pass = ref(null);

const onSubmit = () => {
  Entrar(username.value, pass.value).then(() =>
    router.replace("/Registrar_Alumnos")
  );
};
const validar = (val) => {
  // var myregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  // if (myregex.test(val)) {
  //   return true;
  // } else {
  //   return false;
  // }
  return true;
};

const onReset = () => {
  username.value = null;
  pass.value = null;
};
</script>
