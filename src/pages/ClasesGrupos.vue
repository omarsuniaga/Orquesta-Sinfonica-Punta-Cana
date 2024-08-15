<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">Clases</div>
          <div class="card-body">
            <button type="button" class="btn btn-primary" @click="selectIndividual()">
              Cl ases Individuales
            </button>
            <button type="button" class="btn btn-primary" @click="selectColective()">
              Cl ases Colectivas
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const individual = ref(false);
const colective = ref(false);
const selectIndividual = () => {
  individual.value = true;
  colective.value = false;
  router.push({ name: "Individual" });
};
const selectColective = () => {
  individual.value = false;
  colective.value = true;
  router.push({ name: "Colective" });
};
</script>
