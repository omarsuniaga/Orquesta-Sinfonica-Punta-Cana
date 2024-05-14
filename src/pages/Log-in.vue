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
          <span class="text-white">Version 2024</span>
          <!-- <q-link to="/" class="text-white">Politica?</q-link> -->
        </div>
        <q-space />
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { signIn, watchAuthState } from "../FirebaseService/auth"; // Asegúrate de importar tu función signIn y watchAuthState
const router = useRouter();
const $q = useQuasar();
const username = ref("");
const password = ref("");

const notifyUser = (message, color = "red-4", icon = "cloud_done") => {
  $q.notify({
    message,
    color,
    textColor: "white",
    icon,
  });
};

const onSubmit = async () => {
  try {
    const email = `${username.value}`;
    const res = await signIn(email, password.value);
    if (res._tokenResponse.registered) {
      return router.push("/");
    }
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
        notifyUser("Usuario no encontrado");
        break;
      case "auth/wrong-password":
        notifyUser("Contraseña incorrecta");
        break;
      default:
        notifyUser("Ocurrió un error inesperado");
        break;
    }
  }
};

onMounted(() => {
  watchAuthState((user) => {
    if (user) {
      router.push("/");
    }
  });
});
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
