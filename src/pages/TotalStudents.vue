<template>
  <div class="text-center">
    <h2 class="text-2xl font-bold">{{ total }}</h2>
    <p class="text-sm">Total Students</p>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
});
</script>
