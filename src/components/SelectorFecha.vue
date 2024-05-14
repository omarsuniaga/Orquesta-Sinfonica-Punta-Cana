<template>
  <div class="selector-fecha">
    <q-date
      v-model="localFecha"
      :events="eventos"
      minimal
      today-btn
      mask="YYYY-MM-DD"
    />
    <q-btn
      flat
      color="white"
      :label="localFecha"
      size="18px"
      @click="emit('toggleVisibility')"
    />
    <q-btn
      v-if="localFecha !== hoy"
      color="green-3"
      label="Hoy"
      @click="emit('setToday')"
      round
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  fecha: String,
  hoy: String,
  eventos: Array,
});

const emit = defineEmits(["toggleVisibility", "setToday"]);

// Create a local reactive reference that syncs with the 'fecha' prop
const localFecha = ref(props.fecha);

// Watch for changes in the 'fecha' prop and update 'localFecha' accordingly
watch(
  () => props.fecha,
  (newFecha) => {
    localFecha.value = newFecha;
  }
);

// Watch for changes in 'localFecha' and emit an event with the new value
watch(localFecha, (newFecha) => {
  emit("update:fecha", newFecha);
});
</script>
