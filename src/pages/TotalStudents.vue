<template>
  <div class="row wrap justify-around items-center content-center">
    <q-card
      class="my-card"
      style="
        background-color: white;
        border-radius: 10px;
        border: 1px solid #1a1a1a;
        color: #1a1a1a;
      "
    >
      <q-card-section>
        <div class="text-h6">Coro</div>
        <div class="text">
          <span>
            Varones
            <q-badge
              rounded
              color="primary"
              :label="data.masculinoCoro"
            ></q-badge>
          </span>
          <span>
            Hembras
            <q-badge rounded color="pink" :label="data.femeninoCoro"></q-badge>
          </span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { conteoGeneros } from "../FirebaseService/database";
let data = ref({ femeninoCoro: 12, masculinoCoro: 33 });

onMounted(async () => {
  data.value = await conteoGeneros();
});
console.log("asdasdas", data.value);
</script>
