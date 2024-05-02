<template>
  <div class="q-ma-xl">
    <div class="container">
      <h6 class="text-white">Bienvenidos a OSIJPC</h6>
      <img src="../assets/funeyca.png" alt="" />
      <q-form @submit.prevent="onSubmit" class="q-pa-md">
        <q-input
          bg-color="white"
          v-model="username"
          type="text"
          label="Username: admin/test/profe"
          lazy-rules
          outlined
          :rules="[(val) => (val && val.length > 0) || 'Escribe tu correo']"
        />
        <q-input
          filled
          bg-color="white"
          type="password"
          label="Password"
          v-model="password"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Datos Incorrectos',
          ]"
        />

        <div class="q-gutter-md q-pa-md column">
          <q-btn label="Entrar" type="submit" color="green" />
        </div>
        <div class="inline-block">
          <q-link to="" class="text-white">Version 2024</q-link>
          <!-- <q-link to="/" class="text-white">Politica?</q-link> -->
        </div>
        <q-space />
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { iniciarSesion } from "../firebase";
import { useQuasar } from "quasar";
import { useNivelStore } from "../stores/Niveles";
const store = useNivelStore();

const router = useRouter();
const username = ref("");
const password = ref("");

const $q = useQuasar();
// const { nivel } = storeToRefs(store);
const onSubmit = async () => {
  try {
    const email = `${username.value}@gmail.com`;

    let res = await iniciarSesion(email, password.value);
    if (res._tokenResponse.registered) {
      store.setNivel(email);
      return router.push("/");
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

/* Estilos para dispositivos de pantalla grande */
@media (min-width: 768px) {
  /* Ajustar el ancho del formulario */
  form {
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>
