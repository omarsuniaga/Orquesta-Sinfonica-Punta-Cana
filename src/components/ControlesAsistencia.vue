<template>
  <div class="controles-asistencia">
    <q-btn-group>
      <q-btn color="blue-6" icon="today" @click="$emit('toggleVisibility')" />
      <q-btn
        color="blue-6"
        icon-right="save"
        @click="$emit('guardar')"
        :disabled="presentesVacios"
      />
    </q-btn-group>
    <q-btn-toggle
      class="col-auto flex justify-around"
      rounded
      spread
      stack
      no-caps
      no-wrap
      toggle-color="primary"
      color="green"
      text-color="white"
      v-model="localGrupo"
      :options="opcionesGrupo"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  grupo: String,
  presentesVacios: Boolean,
  opcionesGrupo: Array,
});

const emit = defineEmits(["toggleVisibility", "guardar"]);

// Create a local reactive reference that syncs with the 'grupo' prop
const localGrupo = ref(props.grupo);

// Watch for changes in the 'grupo' prop and update 'localGrupo' accordingly
watch(
  () => props.grupo,
  (newGrupo) => {
    localGrupo.value = newGrupo;
  }
);

// Watch for changes in 'localGrupo' and emit an event with the new value
watch(localGrupo, (newGrupo) => {
  emit("update:grupo", newGrupo);
});
</script>
