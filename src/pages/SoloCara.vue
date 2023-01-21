<template>
  <div class="q-gutter-xl">
    <q-page padding>
      <div class="full-width row justify-between">
        <q-form @submit.prevent="login" class="shadow-14">
          <q-input
            outlined
            v-model="email"
            :rules="[
              (val, rules) => rules.email(val) || 'Please enter a valid email address',
            ]"
            label="Correo Electronico"
            required
            v-bind:class="{ 'is-invalid': errors.email }"
          />
          <q-input
            outlined
            label="Contraseña:"
            v-model="password"
            required
            v-bind:class="{ 'is-invalid': errors.password }"
          />

          <div class="q-pa-md">
            <label for="remember-me">Recuerdame</label>
            <q-checkbox v-model="rememberMe" />
          </div>
          <div class="full-width column wrap justify-center items-center content-center">
            <!-- Enviar formulario -->

            <q-btn
              color="primary"
              label="Iniciar Sesión"
              :disabled="!loading"
              v-on:click="login"
            />
            <q-btn
              color="warning"
              label="Salir"
              :disabled="!loading"
              v-on:click="salir"
            />
          </div>
        </q-form>
        <div v-if="!loading" class="loading-container">
          <div class="loading"></div>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Entrar, Salir } from "firebase";
import { ref } from "vue";
const router = useRouter();
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const errors = ref("");
const loading = ref(true);
onMounted(() => {
  Salir();
});

// const login = async () => await Salir();
// const login = async () => {
//   loading.value = false;
//   await Entrar(email.value, password.value);
//   // setTimeout(() => {
//   //   loading.value = true;
//   //   //ir a inicio
//   //   router.push(`/`);
//   // }, 3000);
// };
</script>
<style>
form {
  width: 65%;
  max-width: 400px;
  margin: 0 auto;
  background-color: white;
  padding: 30px;
}

.q-gutter-xl {
  background-color: #cccccc;
  background-image: url("../assets/bg-pag.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
q-footer {
  background-color: #cccccc;
  background-image: url("../assets/bg-pag.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

/* Define la animación de carga */
.loading-container .loading {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

/* Define la keyframe de la animación */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
