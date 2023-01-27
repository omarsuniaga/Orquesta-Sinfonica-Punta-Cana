<template>
  <div class="q-ma-md">
    <h6 class="text-white">Bienvenidos a OSIJPC</h6>
    <div class="min-width-xl">
      <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-pa-md">
        <q-input
          bg-color="white"
          v-model="username"
          type="text"
          label="Username"
          lazy-rules
          outlined
          :rules="[(val) => (val && val.length > 0) || 'Escribe tu correo']"
        />

        <q-input
          filled
          bg-color="white"
          type="password"
          label="Password"
          v-model="pass"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Datos Incorrectos',
            (val) => validar(val) || 'Caracteres Invalidos',
          ]"
        />

        <div class="q-pa-md column q-gutter-sm">
          <q-btn label="Entrar" type="submit" color="primary" />
        </div>
        <div class="inline-block">
          <!-- <q-link to="/RecuperarClave" class="text-white"
            >Olvidaste tu contraseña?</q-link
          > -->
          <q-space />
          <!-- <q-link to="/" class="text-white">Politica?</q-link> -->
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
const router = useRouter();
const username = ref(null);
const pass = ref(null);

const onSubmit = async () => {
  try {
    // await Entrar(username.value, pass.value);
    let usuario = await signInWithEmailAndPassword(auth, username.value, pass.value);
    await router.replace("/home");

    console.log("usuario desde iniciar sesion ", usuario);
  } catch (error) {
    console.log(error);
  }
};
const validar = (val) => {
  var myregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
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
