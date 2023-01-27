<template>
  <div>
    <div v-if="__SESION">
      <Home />
    </div>
    <div v-else>
      <Login />
    </div>
  </div>
</template>
<script setup>
import { __SESION } from "../firebase";
import Home from "./Home-App.vue";
import Login from "./Log-in.vue";
</script>
