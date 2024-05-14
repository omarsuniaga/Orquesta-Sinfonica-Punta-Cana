<template>
  <q-card
    class="tarjeta-estudiante"
    @click="handleClick"
    @longpress="handleLongPress"
  >
    <q-item>
      <q-item-section avatar>
        <q-avatar
          :name="estudiante.nombre[0]"
          size="sm"
          :style="calcColor()"
        ></q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ estudiante.nombreCompleto }}</q-item-label>
        <q-item-label>
          <div
            v-for="(grupo, index) in estudiante.grupos"
            :key="index"
            class="q-px-sm"
          >
            <q-badge top color="primary" :label="grupo" />
          </div>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  estudiante: Object,
});

const emit = defineEmits(["click", "longPress"]);

function handleClick() {
  emit("click", props.estudiante);
}

function handleLongPress() {
  emit("longPress", props.estudiante);
}

function calcColor() {
  return `background-color: ${
    props.estudiante.presente
      ? "rgba(46, 119, 63, 0.685)"
      : "rgba(152, 80, 54, 0.685)"
  }; border-radius: 50%; padding: 10px; color: white;`;
}
</script>
