<template>
  <div class="col-auto" style="width: 65%">
    <q-input
      outlined
      bottom-slots
      v-model.trim="text"
      label="Buscar Alumnos"
      dense
      @keyup.enter="$emit('onFire', res)"
    >
      <template v-slot:append>
        <q-icon
          v-if="text !== ''"
          name="close"
          @click="Resetear"
          class="cursor-pointer"
        />
        <q-icon name="search" @click="$emit('onFire', res)" />
      </template>
    </q-input>
  </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";
import { Buscar_Alumno_Nombre } from "../firebase";
const props = defineProps({
  text: String,
});
let text = ref("");
let res = ref([]);
const emit = defineEmits(["onFire"]);
emit("onFire", res.value);
const Resetear = () => {
  text.value = "";
  emit("onFire", (res.value.length = []));
};
const Buscar = async () => {
  res.value = await Buscar_Alumno_Nombre(text.value.toLowerCase()).then();
  emit("onFire", res.value);
};
watchEffect(() => {
  if (text.value.length > 0) {
    Buscar();
  }
});
</script>
