<template>
  <div class="q-pa-md" v-if="visible">
    <div class="q-gutter-md row items-start">
      <q-date v-model="date" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import moment from "moment";
let Hoy = moment().format("DD-MM-AAAA");
// export default {
//   name: "Mostrar_Calendario",
//   setup() {
//     return {
//       visible: ref(false),
//       date: ref(Hoy),
//     };
//   },
// };
console.log("Hoy", Hoy);
</script>
