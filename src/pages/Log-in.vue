<template>
  <div class="q-ma-xl">
    <div class="container">
      <h6 class="text-white">Bienvenidos a OSIJPC</h6>
      <img src="../assets/funeyca.png" alt="" />
      <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-pa-md">
        <q-input
          bg-color="white"
          v-model="email"
          type="text"
          label="email"
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
          ]"
        />

        <div class="q-gutter-md q-pa-md column">
          <q-btn label="Entrar" type="submit" color="primary" />
        </div>
        <!-- <div class="inline-block"> -->
        <!-- <q-link to="/RecuperarClave" class="text-white"
            >Olvidaste tu contraseña?</q-link
          > -->
        <!-- <q-link to="/" class="text-white">Politica?</q-link> -->
        <!-- </div> -->
        <q-space />
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useQuasar } from "quasar";
import { useNivelStore } from "../stores/Niveles";

const store = useNivelStore();
const router = useRouter();
const email = ref(null);
const pass = ref(null);
const $q = useQuasar();
// const { nivel } = storeToRefs(store);
const onSubmit = async () => {
  try {
    let res = await signInWithEmailAndPassword(auth, email.value, pass.value);
    if (res._tokenResponse.registered) {
      store.setNivel(email.value);
      return router.push("/home");
    }
  } catch (error) {
    error.code === "auth/user-not-found"
      ? $q.notify({
          message: "Usuario no encontrado",
          color: "red-4",
          textColor: "white",
          icon: "cloud_done",
        })
      : error.code === "auth/wrong-password"
      ? $q.notify({
          message: "Contraseña incorrecta",
          color: "red-4",
          textColor: "white",
          icon: "cloud_done",
        })
      : $q.notify({
          message: "Credenciales invalidas",
          color: "red-4",
          textColor: "white",
          icon: "cloud_done",
        });
  }
};

const onReset = () => {
  email.value = null;
  pass.value = null;
};
</script>
<style>
.container {
  display: inline;
}
.container img {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  display: block;
}
.container h6 {
  text-align: center;
}
q-btn {
  width: 100%;
}
</style>
