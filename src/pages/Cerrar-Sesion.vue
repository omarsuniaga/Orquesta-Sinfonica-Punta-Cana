<template>
  <div class="q-ma-xl">
    <div class="flex text-center justify-center">
      <h6 class="text-white">Hasta Luego</h6>
    </div>
  </div>
</template>

<script setup>
// SessionOut
import { useSignOut } from "../firebase";
setTimeout(() => {
  useSignOut();
  window.location.href = "/login";
}, 2500);
</script>
